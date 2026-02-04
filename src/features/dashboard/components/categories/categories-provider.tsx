import React from "react";
import useDialogState from "@/hooks/use-dialog-state";
import { api } from "@/lib/utils";
import { toast } from "sonner";
import { TRPCClientError } from "@trpc/client";
import { type Category } from "@/lib/types/category";
import { CategoriesDialogs } from "./categories-dialogs";

type CategoriesDialogType = "delete" | "update" | "create";

type CategoriesContextType = {
  dialogOpen: CategoriesDialogType | null;
  setDialogOpen: (str: CategoriesDialogType | null) => void;

  currentCategory: Category | null;
  setCurrentCategory: React.Dispatch<React.SetStateAction<Category | null>>;

  deleteCategoryMutation: ReturnType<typeof api.category.delete.useMutation>;
  updateCategoryMutation: ReturnType<typeof api.category.update.useMutation>;
  createCategoryMutation: ReturnType<typeof api.category.create.useMutation>;

  handleDelete: () => void;
};

const CategoriesContext = React.createContext<CategoriesContextType | null>(
  null,
);

export function CategoriesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useDialogState<CategoriesDialogType>(null);
  const [currentCategory, setCurrentCategory] = React.useState<Category | null>(
    null,
  );

  const trpcUtils = api.useUtils();

  const deleteCategoryMutation = api.category.delete.useMutation({
    onSuccess: () => {
      void trpcUtils.category.getAll.invalidate();
      void trpcUtils.category.getAllWithProducts.invalidate();
      if (open !== null) {
        setOpen(null);
      }
    },
  });

  const updateCategoryMutation = api.category.update.useMutation({
    onSuccess: () => {
      void trpcUtils.category.getAll.invalidate();
      void trpcUtils.category.getAllWithProducts.invalidate();
    },
  });

  const createCategoryMutation = api.category.create.useMutation({
    onSuccess: () => {
      void trpcUtils.category.getAll.invalidate();
      void trpcUtils.category.getAllWithProducts.invalidate();
    },
  });

  const handleDelete = () => {
    if (!currentCategory) return;
    toast.promise(
      deleteCategoryMutation.mutateAsync({ id: currentCategory.id }),
      {
        loading: "Menghapus kategory...",
        success: (data: { name: string }) =>
          `Kategori "${data.name}" berhasil dihapus.`,
        error: (err: unknown) => {
          console.error(err);

          if (err instanceof TRPCClientError) {
            return err.message;
          }
          return "Gagal menghapus kategori.";
        },
      },
    );
  };

  return (
    <CategoriesContext.Provider
      value={{
        dialogOpen: open,
        setDialogOpen: setOpen,
        currentCategory,
        setCurrentCategory,
        deleteCategoryMutation,
        updateCategoryMutation,
        createCategoryMutation,
        handleDelete,
      }}
    >
      {children}
      <CategoriesDialogs />
    </CategoriesContext.Provider>
  );
}

export const useCategories = () => {
  const categoriesContext = React.useContext(CategoriesContext);

  if (!categoriesContext) {
    throw new Error("useCategories has to be used within <CategoriesContext>");
  }

  return categoriesContext;
};
