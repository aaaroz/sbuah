import * as React from "react";
import Link from "next/link";
import { SiFacebook, SiInstagram } from "@icons-pack/react-simple-icons";
import { MapPin } from "lucide-react";
import { Logo } from "../logo";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";

const ICON_SIZE = 36;

const socials = [
  {
    href: "#",
    icon: <SiFacebook size={ICON_SIZE} className="dark:text-rose-950" />,
  },
  {
    href: "#",
    icon: <SiInstagram size={ICON_SIZE} className="dark:text-rose-950" />,
  },
  {
    href: "#",
    icon: <MapPin size={ICON_SIZE} className="dark:text-rose-950" />,
  },
];

const links = [
  { label: "Tentang Kami", href: "/about-us" },
  { label: "Kontak Kami", href: "/contact-us" },
  { label: "Petunjuk & Pertanyaan", href: "/guide-and-faq" },
  { label: "Ketentuan Pengguna", href: "/terms-of-services" },
];

export const Footer = () => {
  const { theme } = useTheme();
  return (
    <footer className="container mt-14 flex flex-col items-center justify-between gap-8 rounded-t-2xl border-2 border-b-0 border-rose-950 p-14 text-rose-950 dark:bg-rose-950 dark:text-foreground md:mt-16">
      <Logo variant={theme === "light" ? "primary" : "secondary"} />
      <nav>
        <ul className="flex flex-wrap justify-center gap-4 text-sm font-semibold md:gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              as={link.href}
              className="underline-offset-2 hover:underline md:text-lg"
            >
              <li>{link.label}</li>
            </Link>
          ))}
        </ul>
      </nav>
      <div className="flex gap-4">
        {socials.map((social) => (
          <Button
            key={social.href}
            asChild
            className="h-11 w-11 rounded-full bg-rose-950/90 p-0 hover:bg-rose-900 dark:bg-foreground dark:hover:bg-foreground/90"
          >
            <Link href={social.href}>{social.icon}</Link>
          </Button>
        ))}
      </div>
      <p className="text-sm md:text-base">
        &copy; 2023 S{"'"}BUAH Ibu Popon. Hak Cipta Dilindungi Undang-Undang.
      </p>
    </footer>
  );
};
