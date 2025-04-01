import { useContext } from "react";
import { useRouter } from "next/navigation";
import * as actions from "./actions";
import { AuthContext } from ".";
import { AuthError } from "./error";
import { AuthHook, LoginPayload, SignupPayload } from "./types";

export const useAuth = (): AuthHook => {
  const context = useContext(AuthContext);
  const router = useRouter();

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  const { updateAuthState, ...state } = context;

  const executeAction = async <T>(
    action: () => Promise<T>,
    successCallback?: (data: T) => void
  ) => {
    try {
      const result = await action();
      successCallback?.(result);
      return result;
    } catch (error) {
      updateAuthState({ error: AuthError.fromError(error) });
      throw error;
    }
  };

  const login = async (payload: LoginPayload) =>
    executeAction(
      () => actions.login(payload),
      (user) => {
        updateAuthState({ user, isAuthenticated: true });
      }
    );

  const logout = async () =>
    executeAction(actions.logout, () => {
      updateAuthState({ user: null, isAuthenticated: false });
      router.push("/login");
    });

  const signup = async (payload: SignupPayload) =>
    executeAction(() => actions.signup(payload));

  return {
    ...state,
    login,
    logout,
    signup,
    updateAuthState,
  };
};
