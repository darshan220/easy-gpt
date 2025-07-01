"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { useAuth } from "@/components/Auth/AuthContext";
import Link from "next/link";

const signUpSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ name: string; email: string; password: string }>({
    resolver: zodResolver(signUpSchema),
  });
  const { signUp, loading } = useAuth();

  const onSubmit = (data: {
    name: string;
    email: string;
    password: string;
  }) => {
    signUp(data.email, data.password, data.name);
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setError("");
  //   signUp(email, password, name).then(() => {
  //     router.push("/");
  //   });
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="backdrop-blur-lg bg-black/50 p-8 rounded-2xl shadow-2xl w-full max-w-md relative"
      >
        <h2 className="text-2xl text-white mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col">
            <div>
              <label className="left-0 text-gray-400 text-sm pointer-events-none transition-all duration-300">
                Name
              </label>
            </div>
            <div>
              <input
                {...register("name")}
                className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500 text-white placeholder-transparent"
                placeholder="Name"
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <div>
              <label className="left-0 text-gray-400 text-sm pointer-events-none transition-all duration-300">
                Email
              </label>
            </div>
            <div>
              <input
                {...register("email")}
                className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500 text-white placeholder-transparent"
                placeholder="Email"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <div>
              <label className="left-0 text-gray-400 text-sm pointer-events-none transition-all duration-300">
                Password
              </label>
            </div>
            <div>
              <input
                type="password"
                {...register("password")}
                className="w-full bg-transparent border-b border-gray-500 focus:outline-none focus:border-blue-500 text-white placeholder-transparent"
                placeholder="Password"
              />
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>
          <button
            disabled={loading}
            type="submit"
            className="w-full py-2 rounded-lg bg-white/10 text-white backdrop-blur-lg hover:cursor-pointer relative overflow-hidden"
          >
            <span className="absolute inset-0 hover:backdrop-blur-xl"></span>
            <span className="relative">Sign Up</span>
          </button>
        </form>
        <Link href="/sign-in">
          <button className=" underline cursor-pointer text-xs text-gray-400 mt-4 hover:text-white">
            Already have an account? Sign In
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
