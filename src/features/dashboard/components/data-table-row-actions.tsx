import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { type Row } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import {
  productSchema,
  productStatusEnum,
} from "@/lib/schemas/product/product-schema";
import { toast } from "sonner";
import { useProducts } from "./products-provider";
import { type Product } from "@/lib/types/product";
import type z from "zod";

type DataTableRowActionsProps<TData> = {
  row: Row<TData>;
};

export function DataTableRowActions<TData>({
  row: row,
}: DataTableRowActionsProps<TData>) {
  const router = useRouter();
  const product = productSchema.parse(row.original);
  const {
    updateProductMutation: updateProduct,
    setDialogOpen,
    setCurrentRow,
  } = useProducts();

  const handleStatusChange = (status: z.infer<typeof productStatusEnum>) => {
    toast.promise(updateProduct.mutateAsync({ ...product, status }), {
      loading: "Menyimpan produk...",
      success: (data: { name: string }) =>
        `Produk "${data.name}" berhasil disimpan.`,
      error: (err: unknown) => {
        console.error(err);
        return "Gagal menyimpan produk.";
      },
    });
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem
          onClick={() => {
            router.push(`/dashboard/products/${product.id}`);
          }}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuRadioGroup value={product.status}>
              <DropdownMenuRadioGroup value={product.status}>
                <DropdownMenuRadioItem
                  value={productStatusEnum.enum.ACTIVE}
                  onClick={() => handleStatusChange("ACTIVE")}
                >
                  Aktif
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value={productStatusEnum.enum.ARCHIVED}
                  onClick={() => handleStatusChange("ARCHIVED")}
                >
                  Tidak Aktif
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(product as Product);
            setDialogOpen("delete");
          }}
        >
          Delete
          <DropdownMenuShortcut>
            <Trash2 size={16} />
          </DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
