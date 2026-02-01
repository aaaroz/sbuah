import React from "react";
import useDialogState from "@/hooks/use-dialog-state";
import { api } from "@/lib/utils";
import { toast } from "sonner";
import { type Product } from "@/lib/types/product";
import { TRPCClientError } from "@trpc/client";
import { ProductsDialogs } from "./products-dialogs";

type ProductsDialogType = "delete" | "bulk-delete" | "preview";

type ProductsContextType = {
  dialogOpen: ProductsDialogType | null;
  setDialogOpen: (str: ProductsDialogType | null) => void;

  currentRow: Product | null;
  setCurrentRow: React.Dispatch<React.SetStateAction<Product | null>>;

  deleteProductMutation: ReturnType<typeof api.product.delete.useMutation>;
  bulkDeleteProductMutation: ReturnType<
    typeof api.product.bulkDelete.useMutation
  >;
  updateProductMutation: ReturnType<typeof api.product.update.useMutation>;
  updateBulkStatusProductMutation: ReturnType<
    typeof api.product.bulkUpdateStatus.useMutation
  >;
  createProductMutation: ReturnType<typeof api.product.create.useMutation>;

  handleDelete: () => void;
};

const ProductsContext = React.createContext<ProductsContextType | null>(null);

export function ProductsProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useDialogState<ProductsDialogType>(null);
  const [currentRow, setCurrentRow] = React.useState<Product | null>(null);

  const trpcUtils = api.useUtils();

  const deleteProductMutation = api.product.delete.useMutation({
    onSuccess: () => {
      void trpcUtils.product.getAll.invalidate();
      if (open !== null) {
        setOpen(null);
      }
    },
  });

  const bulkDeleteProductMutation = api.product.bulkDelete.useMutation({
    onSuccess: () => {
      void trpcUtils.product.getAll.invalidate();
    },
  });

  const updateProductMutation = api.product.update.useMutation({
    onSuccess: () => {
      void trpcUtils.product.getAll.invalidate();
    },
  });

  const updateBulkStatusProductMutation =
    api.product.bulkUpdateStatus.useMutation({
      onSuccess: () => {
        void trpcUtils.product.getAll.invalidate();
      },
    });

  const createProductMutation = api.product.create.useMutation({
    onSuccess: () => {
      void trpcUtils.product.getAll.invalidate();
    },
  });

  const handleDelete = () => {
    if (!currentRow) return;
    toast.promise(deleteProductMutation.mutateAsync({ id: currentRow.id }), {
      loading: "Menghapus produk...",
      success: (data: { name: string }) =>
        `Produk "${data.name}" berhasil dihapus.`,
      error: (err: unknown) => {
        console.error(err);

        if (err instanceof TRPCClientError) {
          return err.message;
        }
        return "Gagal menghapus produk.";
      },
    });
  };

  return (
    <ProductsContext.Provider
      value={{
        dialogOpen: open,
        setDialogOpen: setOpen,
        currentRow,
        setCurrentRow,
        deleteProductMutation,
        bulkDeleteProductMutation,
        updateProductMutation,
        updateBulkStatusProductMutation,
        createProductMutation,
        handleDelete,
      }}
    >
      {children}
      <ProductsDialogs />
    </ProductsContext.Provider>
  );
}

export const useProducts = () => {
  const productsContext = React.useContext(ProductsContext);

  if (!productsContext) {
    throw new Error("useProducts has to be used within <ProductsContext>");
  }

  return productsContext;
};
