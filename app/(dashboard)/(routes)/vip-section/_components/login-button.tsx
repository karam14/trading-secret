"use client";

// @ts-expect-error - no types
import { useRouter } from 'nextjs-toploader/app';import { Button } from "@/components/ui/button";

export default function LoginButton() {
  const router = useRouter();

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <Button variant="subtleGradient" onClick={handleLogin}>
      تسجيل الدخول
    </Button>
  );
}
