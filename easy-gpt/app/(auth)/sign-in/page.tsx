"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useAuth } from "@/components/Auth/AuthContext";
import Link from "next/link";

const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ email: string; password: string }>({
    resolver: zodResolver(signInSchema),
  });
  const { signIn, loading } = useAuth();

  const onSubmit = (data: { email: string; password: string }) => {
    console.log("Form Data:", data);
    signIn(data.email, data.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-lg bg-black/50 p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
      >
        <h2 className="text-2xl text-white mb-6 text-center">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="relative">
            <input
              {...register("email")}
              className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500 text-white placeholder-transparent"
              placeholder="Email"
            />
            <motion.label
              initial={{ y: 0 }}
              animate={{ y: "input" in errors && errors.email ? 0 : -20 }}
              className="absolute left-0 text-gray-400 text-sm pointer-events-none transition-all duration-300"
            >
              Email
            </motion.label>
            {errors.email && (
              <p className="text-red-400 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div className="relative">
            <input
              type="password"
              {...register("password")}
              className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500 text-white placeholder-transparent"
              placeholder="Password"
            />
            <motion.label
              initial={{ y: 0 }}
              animate={{ y: "input" in errors && errors.password ? 0 : -20 }}
              className="absolute left-0 text-gray-400 text-sm pointer-events-none transition-all duration-300"
            >
              Password
            </motion.label>
            {errors.password && (
              <p className="text-red-400 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-white/10 text-white backdrop-blur-lg hover:bg-white/20 cursor-pointer relative overflow-hidden"
          >
            <span className="relative">Sign In</span>
          </button>
        </form>
        <Link href="/sign-up">
          <button className=" hover:cursor-pointer underline text-xs text-gray-400 mt-4 hover:text-white">
            Don&apos;t have an account? Sign Up
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
