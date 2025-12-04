import * as React from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export const LandingPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="flex min-h-screen flex-col gap-8 bg-background px-4 pt-11">
      <Navbar />
      <div>{children}</div>
      <Footer />
    </main>
  );
};
