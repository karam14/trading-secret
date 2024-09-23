"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "@supabase/auth-helpers-react";
import { signIn, signUp } from "./_components/serverActions";
import { createClient } from "@/utils/supabase/client";

const supabase = createClient();

export default function AuthForm({ searchParams }: { searchParams: { message: string } }) {
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false); // For confirm password field
  const [isSignUp, setIsSignUp] = useState(false); // Track if it's signup mode
  const [loading, setLoading] = useState(false); // Track loading state
  const session = useSession();
  const router = useRouter();

  // Redirect to home if already logged in
  useEffect(() => {
    if (session) {
      router.replace('/');
    }
  }, [session, router]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setConfirmPassword(!confirmPassword);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    if (isSignUp) {
      await signUp(formData);
    } else {
      await signIn(formData);
    }

    setLoading(false);
  };

  if (session) {
    return <div>Loading...</div>; // Optional loading state while redirecting
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <Link
        href="/"
        className="absolute right-8 top-8 py-2 px-4 rounded-md text-foreground hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="ml-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        العودة
      </Link>

      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-right">
        <div className="flex justify-between mb-6">
          <button
            onClick={() => setIsSignUp(false)}
            className={`w-1/2 text-center py-2 rounded-md transition-colors duration-300 ${
              !isSignUp ? "bg-gray-200 dark:bg-gray-700 text-primary" : "text-gray-500"
            }`}
          >
            تسجيل الدخول
          </button>
          <button
            onClick={() => setIsSignUp(true)}
            className={`w-1/2 text-center py-2 rounded-md transition-colors duration-300 ${
              isSignUp ? "bg-gray-200 dark:bg-gray-700 text-primary" : "text-gray-500"
            }`}
          >
            إنشاء حساب
          </button>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  الاسم الأول
                </label>
                <Input
                  name="firstName"
                  placeholder="أدخل الاسم الأول"
                  required
                  className="text-right"
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  الاسم الأخير
                </label>
                <Input
                  name="lastName"
                  placeholder="أدخل الاسم الأخير"
                  required
                  className="text-right"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              البريد الإلكتروني
            </label>
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              className="text-right"
            />
          </div>

          <div className="relative">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              كلمة المرور
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              required
              className="text-right"
            />
            <div
              className="absolute inset-y-0 left-0 flex items-center px-3 cursor-pointer"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </div>
          </div>

          {isSignUp && (
            <div className="relative">
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
                تأكيد كلمة المرور
              </label>
              <Input
                type={confirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="••••••••"
                required
                className="text-right"
              />
              <div
                className="absolute inset-y-0 left-0 flex items-center px-3 cursor-pointer"
                onClick={toggleConfirmPasswordVisibility}
              >
                {confirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gray-700 dark:bg-gray-600 text-white hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors duration-300"
            disabled={loading}
          >
            {loading ? "جارٍ التحميل..." : isSignUp ? "إنشاء حساب" : "تسجيل الدخول"}
          </Button>

          {searchParams?.message && (
            <p className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 text-center">
              {searchParams.message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
