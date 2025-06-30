"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/Auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/components/Auth/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { user, isAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuth) {
      router.push("/");
    } else {
      router.push("/sign-in");
    }
  }, [isAuth, user]);

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <AuthWrapper>{children}</AuthWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
