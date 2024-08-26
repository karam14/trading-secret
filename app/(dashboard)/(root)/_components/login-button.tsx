"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
