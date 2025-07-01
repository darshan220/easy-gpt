"use client";
import { useAuth } from "../Auth/AuthContext";
import { useEffect } from "react";
import { ClassicLoader } from "../Loader/Loader";
import { useRouter } from "next/navigation";

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isAuth, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (isAuth) {
        router.push("/");
      } else {
        router.push("/sign-in");
      }
    }
  }, [isAuth, loading, router]);

  if (loading) {
    return (
      <div>
        <ClassicLoader />
      </div>
    );
  }

  return <>{children}</>;
};
