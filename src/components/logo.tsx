import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type LogoProps = {
  variant?: "primary" | "secondary";
  className?: string;
  isImageOnly?: boolean;
};

export function Logo({
  variant = "primary",
  className,
  isImageOnly = false,
}: LogoProps) {
  const src = variant === "primary" ? "/logo.svg" : "/logo-white.svg";

  const image = (
    <Image
      src={src}
      alt="S'BUAH"
      width={120}
      height={120}
      className={cn("h-auto w-auto max-w-32", className)}
      priority
    />
  );

  if (isImageOnly) {
    return image;
  }

  return <Link href="/">{image}</Link>;
}
