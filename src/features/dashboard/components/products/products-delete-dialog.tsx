import { ConfirmDialog } from "@/components/commons/confirm-dialog";
import { useProducts } from "./products-provider";

interface ProductsDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductsDeleteDialog({
  open,
  onOpenChange,
}: ProductsDeleteDialogProps) {
  const { handleDelete, currentRow } = useProducts();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Hapus Produk"
      desc={`Apakah Anda yakin ingin menghapus produk "${currentRow?.name}" ini? Tindakan ini tidak dapat dibatalkan.`}
      confirmText="Hapus"
      destructive
      handleConfirm={handleDelete}
      className="sm:max-w-sm"
    />
  );
}
