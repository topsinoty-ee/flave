import * as actions from "./actions";
import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types";

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  getCurrentUser: () => Promise<User>;
  login: (credentials: actions.LoginPayload) => Promise<void>;
  logout: () => Promise<void>;
  signup: (credentials: actions.SignupPayload) => Promise<void>;
  refetchUser: () => Promise<void>;
};
const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetchUser = async () => {
    try {
      const response = await actions.getCurrentUser();
      setUser(response.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refetchUser();
  }, []);

  const login = async (credentials: actions.LoginPayload) => {
    await actions.login(credentials);
    await refetchUser();
  };

  const signup = async (credentials: actions.SignupPayload) => {
    await actions.signup(credentials);
    await refetchUser();
  };

  const logout = async () => {
    await actions.logout();
    setUser(null);
  };
  const getCurrentUser = async () => {
    return (await actions.getCurrentUser()).data.data;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        getCurrentUser,
        isAuthenticated: !!user,
        login,
        logout,
        signup,
        refetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
