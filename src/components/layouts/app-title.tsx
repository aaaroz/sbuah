import { PanelLeft, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import Link from "next/link";
import { Logo } from "../logo";
import { useTheme } from "next-themes";

export function AppTitle() {
  const { setOpenMobile } = useSidebar();
  const { theme } = useTheme();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          className="gap-0 py-0 hover:bg-transparent active:bg-transparent"
          asChild
        >
          <div>
            <Link
              href="/dashboard"
              onClick={() => setOpenMobile(false)}
              className="grid flex-1 text-start text-sm leading-tight"
            >
              <div className="truncate">
                <Logo
                  variant={theme === "light" ? "primary" : "secondary"}
                  isImageOnly
                />
              </div>
            </Link>
            <ToggleSidebar />
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function ToggleSidebar({
  className,
  onClick,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      data-sidebar="trigger"
      data-slot="sidebar-trigger"
      variant="ghost"
      size="icon"
      className={cn("aspect-square size-8 max-md:scale-125", className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <X className="md:hidden" />
      <PanelLeft className="max-md:hidden" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}
