import { type ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table";
import { DataTableRowActions } from "./data-table-row-actions";
import { type Product } from "@/lib/types/product";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const productsColumns: ColumnDef<Product>[] = [
  // ====================
  // Row selection
  // ====================
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ====================
  // Product ID
  // ====================
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] truncate text-muted-foreground">
        {row.getValue("id")}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },

  // ====================
  // Product name
  // ====================
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    meta: {
      className: "ps-1 max-w-0 w-2/3",
      tdClassName: "ps-4",
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Avatar className="size-10 rounded-full bg-white">
          <AvatarImage
            src={row.original.imageUrl ?? ""}
            alt={row.original.name}
          />
          <AvatarFallback className="rounded-full">
            {row.original.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-0.5">
          <span className="truncate font-medium">{row.getValue("name")}</span>
          {row.original.description && (
            <span className="truncate text-xs text-muted-foreground">
              {row.original.description}
            </span>
          )}
        </div>
      </div>
    ),
  },

  // ====================
  // Price
  // ====================
  {
    accessorKey: "price",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Price" />
    ),
    meta: { className: "ps-1", tdClassName: "ps-4" },
    cell: ({ row }) => {
      const price = row.getValue<number>("price");

      return (
        <span className="font-medium">Rp {price.toLocaleString("id-ID")}</span>
      );
    },
  },

  // ====================
  // Category
  // ====================
  {
    id: "category",
    accessorFn: (row) => row.category?.id,
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    meta: { className: "ps-1", tdClassName: "ps-4" },
    filterFn: (row, id, value: boolean[]) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      const category = row.original.category?.name ?? "-";

      return <span className="font-medium">{category}</span>;
    },
  },

  // ====================
  // Active status
  // ====================
  {
    accessorKey: "isActive",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    meta: { className: "ps-1", tdClassName: "ps-4" },
    cell: ({ row }) => {
      const isActive = row.getValue<boolean>("isActive");

      return (
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Active" : "Inactive"}
        </Badge>
      );
    },
    enableHiding: false,
    enableSorting: false,
  },

  // ====================
  // Created at
  // ====================
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => {
      const date = row.getValue<Date>("createdAt");

      return (
        <span className="text-sm text-muted-foreground">
          {new Intl.DateTimeFormat("id-ID", {
            dateStyle: "medium",
          }).format(date)}
        </span>
      );
    },
  },

  // ====================
  // Actions
  // ====================
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
