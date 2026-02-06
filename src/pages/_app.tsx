import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type AppType } from "next/app";
import { ThemeProvider } from "@/components/theme-provider";
import { api } from "@/lib/utils";
import { Toaster } from "sonner";
import { LayoutProvider } from "@/lib/contexts/layout-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <div className={GeistSans.className}>
        <LayoutProvider>
          <SidebarProvider>
            <TooltipProvider delayDuration={0}>
              <Component {...pageProps} />
            </TooltipProvider>
          </SidebarProvider>
        </LayoutProvider>
        <Toaster />
      </div>
    </ThemeProvider>
  );
};

export default api.withTRPC(MyApp);
