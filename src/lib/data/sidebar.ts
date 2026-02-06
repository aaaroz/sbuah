import { type SidebarData } from "@/components/layouts/types";
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
          title: "Produk",
          // url: "/dashboard/products",
          icon: Package,
          items: [
            {
              title: "List Produk",
              url: "/dashboard/products",
              //    icon: Package,
            },
            {
              title: "Tambah Produk",
              url: "/dashboard/products/new",
              //    icon: Package,
            },
            {
              title: "Kategori Produk",
              url: "/dashboard/categories",
              //   icon: Package,
            },
          ],
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
