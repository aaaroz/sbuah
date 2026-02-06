import { SidebarInset } from "../ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { cn } from "@/lib/utils";
import { SearchProvider } from "@/lib/contexts/search-provider";
import { AuthRoute } from "./auth-route";

const DashboardPageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthRoute>
      <SearchProvider>
        <AppSidebar />
        <SidebarInset
          className={cn(
            // Set content container, so we can use container queries
            "@container/content",

            // If layout is fixed, set the height
            // to 100svh to prevent overflow
            "has-data-[layout=fixed]:h-svh",

            // If layout is fixed and sidebar is inset,
            // set the height to 100svh - spacing (total margins) to prevent overflow
            "has-data-[layout=fixed]:peer-data-[variant=inset]:h-[calc(100svh-(var(--spacing)*4))]",
          )}
        >
          {children}
        </SidebarInset>
      </SearchProvider>
    </AuthRoute>
  );
};

export default DashboardPageLayout;
