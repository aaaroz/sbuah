import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Props = {
  variant?: "primary" | "secondary";
  className?: string;
};

export const Logo = ({ variant, className }: Props) => {
  if (variant === "primary") {
    return (
      <Link href="/">
        <Image
          src="/logo.svg"
          alt="S'BUAH"
          width={120}
          height={120}
          className={cn("h-auto w-auto max-w-32", className)}
          priority
        />
      </Link>
    );
  }
  return (
    <Link href="/">
      <Image
        src="/logo-white.svg"
        alt="S'BUAH"
        width={120}
        height={120}
        className={cn("h-auto w-auto max-w-32", className)}
        priority
      />
    </Link>
  );
};
