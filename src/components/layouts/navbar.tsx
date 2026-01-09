import * as React from "react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Logo } from "../logo";
import { Moon, SquareMenu, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export const Navbar = () => {
  const { setTheme, theme } = useTheme();
  return (
    <header className="container flex w-full items-center justify-between">
      <Logo variant={theme === "light" ? "primary" : "secondary"} />
      <div className="flex items-center gap-4">
        <Button className="px-4" asChild>
          <Link href="/menu">
            <SquareMenu className="text-white" />
            Menu
          </Link>
        </Button>
        <Button
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          size="icon"
        >
          {theme === "light" ? <Moon /> : <Sun />}
        </Button>
      </div>
    </header>
  );
};
