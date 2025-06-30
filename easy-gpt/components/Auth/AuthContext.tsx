"use client";
import { useRouter, usePathname } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  isAuth: boolean;
  user: User | null;
  logout: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Start with true to handle initial load
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const isAuthPage = pathname === "/sign-in" || pathname === "/sign-up";

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3080/user/me", {
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      const data = await response.json();
      setUser(data.user);
      return data.user;
    } catch (error) {
      console.error("Error fetching user:", error);
      setError("Failed to fetch user data");
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Check auth status on initial load and page refresh
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchUser();
        // If user is on auth page but already authenticated, redirect to home
        if (isAuthPage) {
          router.push("/");
        }
      } catch (error) {
        console.log(error)
        // If not authenticated and not on auth page, redirect to login
        if (!isAuthPage) {
          router.push("/sign-in");
        }
      }
    };

    checkAuth();
  }, [isAuthPage, pathname]);

  const logout = async () => {
    try {
      setLoading(true);
      await fetch("http://localhost:3080/user/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      setUser(null);
      setLoading(false);
      router.push("/login");
    }
  };

  const authRequest = async (
    url: string,
    body: Record<string, unknown>
  ): Promise<string | null> => {
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Request failed");
      }

      return data.token;
    } catch (error) {
      console.error(`Error in auth request (${url}):`, error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      await authRequest("http://localhost:3080/user/login", {
        email,
        password,
      });
      await fetchUser();
      router.push("/");
    } catch (error) {
      console.error("Sign in error:", error);
      setError("Failed to sign in. Please check your credentials.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      await authRequest("http://localhost:3080/user/signup", {
        email,
        password,
        name,
      });
      await fetchUser();
      router.push("/");
    } catch (error) {
      console.error("Sign up error:", error);
      setError("Failed to sign up. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuth: !!user, user, logout, signIn, signUp, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
