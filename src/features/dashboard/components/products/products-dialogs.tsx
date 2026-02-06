import { ProductsDeleteDialog } from "./products-delete-dialog";
import { useProducts } from "./products-provider";

export function ProductsDialogs() {
  const { dialogOpen: open, setDialogOpen: setOpen } = useProducts();
  return (
    <>
      <ProductsDeleteDialog
        key="products-delete"
        open={open === "delete"}
        onOpenChange={() => setOpen("delete")}
      />
    </>
  );
}
