import * as React from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

export const LandingPageLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <main className="bg-background flex min-h-screen flex-col gap-8 px-4 pt-11 lg:mx-auto lg:max-w-6xl">
      <Navbar />
      <div>{children}</div>
      <Footer />
    </main>
  );
};
