"use client";

import { useContext } from "react";
import { useRouter } from "next/navigation";
import * as actions from "./actions";
import {
  AuthState,
  BareActionFunction,
  EnhancedActionFunction,
  AuthenticationResponse,
  LoginPayload,
  SignupPayload,
} from "./types";
import { AuthContext } from ".";
import { AuthError } from "./error";

interface AuthenticationHookResult extends AuthState {
  updateAuthState: (newState: Partial<AuthState>) => void;
  actions: Record<string, EnhancedActionFunction>;
}

interface ActionExecutionOptions {
  success?: string;
  error?: string;
}

export interface AuthActions {
  login(credentials: LoginPayload, redirectOptions?: string): Promise<void>;
  login(
    credentials: LoginPayload,
    redirectOptions?: ActionExecutionOptions
  ): Promise<void>;

  logout(redirectOptions?: string): Promise<void>;
  logout(redirectOptions?: ActionExecutionOptions): Promise<void>;

  signup(
    registrationData: SignupPayload,
    redirectOptions?: string
  ): Promise<void>;
  signup(
    registrationData: SignupPayload,
    redirectOptions?: ActionExecutionOptions
  ): Promise<void>;
}

export const useAuth = (): AuthenticationHookResult & AuthActions => {
  const context = useContext(AuthContext);
  const navigationRouter = useRouter();

  if (!context)
    throw new Error(
      "Authentication context must be used within an AuthenticationProvider"
    );

  const { updateAuthState, ...authenticationState } = context;

  const handleActionExecution = async <
    ActionParameters extends unknown[],
    ActionResult,
  >(
    action: BareActionFunction<ActionParameters, ActionResult>,
    parameters: ActionParameters,
    redirectOptions?: ActionExecutionOptions
  ): Promise<ActionResult> => {
    try {
      updateAuthState({
        isLoading: true,
        error: null,
      });
      const actionResult = await action(...parameters);

      if (redirectOptions?.success) {
        navigationRouter.push(redirectOptions.success);
      }

      return actionResult;
    } catch (error) {
      const formattedError =
        error instanceof Error
          ? new AuthError(error.message)
          : new AuthError("An unexpected authentication error occurred");

      updateAuthState({
        error: formattedError,
        isLoading: false,
      });

      if (redirectOptions?.error) {
        navigationRouter.push(redirectOptions.error);
      }

      throw formattedError;
    } finally {
      updateAuthState({ isLoading: false });
    }
  };

  const createEnhancedAction = <
    ActionParameters extends unknown[],
    ActionResult,
  >(
    action: BareActionFunction<ActionParameters, ActionResult>
  ): EnhancedActionFunction<ActionParameters, ActionResult> => {
    return async (
      ...parameters: ActionParameters
    ): Promise<AuthenticationResponse<ActionResult>> => {
      try {
        const result = await action(...parameters);
        return { result };
      } catch (error) {
        return {
          error:
            error instanceof Error
              ? new AuthError(error.message)
              : new AuthError("Action execution failed"),
          result: undefined,
        };
      }
    };
  };

  const enhancedActions = Object.entries(actions).reduce(
    (accumulator, [actionName, actionFunction]) => ({
      ...accumulator,
      [actionName]: createEnhancedAction(actionFunction as BareActionFunction),
    }),
    {} as Record<string, EnhancedActionFunction>
  );

  const login = async (
    credentials: LoginPayload,
    redirectOptions?: string | ActionExecutionOptions
  ): Promise<void> => {
    const options =
      typeof redirectOptions === "string"
        ? { success: redirectOptions }
        : redirectOptions;

    await handleActionExecution(actions.login, [credentials], options);
  };

  const logout = async (
    redirectOptions?: string | ActionExecutionOptions
  ): Promise<void> => {
    const options =
      typeof redirectOptions === "string"
        ? { success: redirectOptions }
        : redirectOptions;

    await handleActionExecution(actions.logout, [], options);
  };

  const signup = async (
    registrationData: SignupPayload,
    redirectOptions?: string | ActionExecutionOptions
  ): Promise<void> => {
    const options =
      typeof redirectOptions === "string"
        ? { success: redirectOptions }
        : redirectOptions;

    await handleActionExecution(actions.signup, [registrationData], options);
  };

  return {
    ...authenticationState,
    updateAuthState,
    actions: enhancedActions,
    login,
    logout,
    signup,
  };
};
