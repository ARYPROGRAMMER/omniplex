import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  isOpen: boolean;
};

const Auth = ({ isOpen }: Props) => {
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      router.push("/login");
    }
  }, [isOpen, router]);

  return null; // No UI needed here since we're redirecting
};

export default Auth;
