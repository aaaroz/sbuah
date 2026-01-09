import {
  LayoutDashboard,
  HelpCircle,
  Package,
  Palette,
  Settings,
  Wrench,
  UserCog,
  ReceiptText,
} from "lucide-react";
import { type SidebarData } from "../types";

export const sidebarData: SidebarData = {
  user: {
    name: "Admin",
    email: "admin@sbuah.com",
    avatar: "/avatars/admin.jpg",
  },
  navGroups: [
    {
      title: "General",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
          icon: LayoutDashboard,
        },
        {
          title: "Products",
          url: "/dashboard/products",
          icon: Package,
        },
        {
          title: "Orders",
          url: "/dashboard/orders",
          icon: ReceiptText,
        },
      ],
    },
    {
      title: "Other",
      items: [
        {
          title: "Settings",
          icon: Settings,
          items: [
            {
              title: "Profile",
              url: "#",
              icon: UserCog,
            },
            {
              title: "Account",
              url: "#",
              icon: Wrench,
            },
            {
              title: "Appearance",
              url: "#",
              icon: Palette,
            },
          ],
        },
        {
          title: "Help Center",
          url: "#",
          icon: HelpCircle,
        },
      ],
    },
  ],
};
