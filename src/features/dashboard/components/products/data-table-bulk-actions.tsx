import { useState } from "react";
import { type Table } from "@tanstack/react-table";
import { Trash2, CircleArrowUp, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DataTableBulkActions as BulkActionsToolbar } from "@/components/data-table";
import { type Product } from "@/lib/types/product";
import { ProductsMultiDeleteDialog } from "./products-multi-delete-dialog";
import {
  type ProductsStatusEnum,
  productStatusEnum,
} from "@/lib/schemas/product/product-schema";
import { useProducts } from "./products-provider";

type DataTableBulkActionsProps<TData> = {
  table: Table<TData>;
};

export function DataTableBulkActions<TData>({
  table,
}: DataTableBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const { updateBulkStatusProductMutation } = useProducts();

  const handleBulkStatusChange = (status: ProductsStatusEnum) => {
    const selectedProducts = selectedRows.map((row) => row.original as Product);
    const ids = selectedProducts.map((item) => item.id);
    toast.promise(
      updateBulkStatusProductMutation.mutateAsync({ ids, status }),
      {
        loading: "Mengubah status...",
        success: () => {
          table.resetRowSelection();
          return `Status diubah menjadi "${status === "ACTIVE" ? "Aktif" : "Tidak Aktif"}" untuk ${selectedProducts.length} produk yang dipilih.`;
        },
        error: "Error menyimpan status produk.",
      },
    );
    table.resetRowSelection();
  };

  return (
    <>
      <BulkActionsToolbar table={table} entityName="product">
        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8"
                  aria-label="Update status"
                  title="Update status"
                >
                  <CircleArrowUp />
                  <span className="sr-only">Update status</span>
                </Button>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Update status</p>
            </TooltipContent>
          </Tooltip>
          <DropdownMenuContent sideOffset={14}>
            {[
              {
                value: productStatusEnum.enum.ARCHIVED,
                label: "Tidak Aktif",
                icon: X,
              },
              {
                value: productStatusEnum.enum.ACTIVE,
                label: "Aktif",
                icon: Check,
              },
            ].map((status) => (
              <DropdownMenuItem
                key={status.value}
                defaultValue={status.value}
                onClick={() => handleBulkStatusChange(status.value)}
              >
                {status.icon && (
                  <status.icon className="size-4 text-muted-foreground" />
                )}
                {status.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              className="size-8"
              aria-label="Delete selected products"
              title="Hapus produk yang dipilih"
            >
              <Trash2 />
              <span className="sr-only">Hapus produk yang dipilih</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hapus produk yang dipilih</p>
          </TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <ProductsMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        table={table}
      />
    </>
  );
}
