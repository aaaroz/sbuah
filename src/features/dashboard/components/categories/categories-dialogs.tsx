import { CategoriesDeleteDialog } from "./categories-delete-dialog";
import { CategoriesMutateDialog } from "./categories-mutate-dialog";
import { useCategories } from "./categories-provider";

export function CategoriesDialogs() {
  const {
    dialogOpen: open,
    setDialogOpen: setOpen,
    currentCategory,
  } = useCategories();
  return (
    <>
      <CategoriesMutateDialog
        key="categories-create"
        open={open === "create"}
        onOpenChange={() => setOpen("create")}
      />
      {currentCategory && (
        <>
          <CategoriesMutateDialog
            key="categories-update"
            open={open === "update"}
            onOpenChange={() => setOpen("update")}
          />
          <CategoriesDeleteDialog
            key="categories-delete"
            open={open === "delete"}
            onOpenChange={() => setOpen("delete")}
          />
        </>
      )}
    </>
  );
}
