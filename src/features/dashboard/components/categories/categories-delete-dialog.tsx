import { ConfirmDialog } from "@/components/commons/confirm-dialog";
import { useCategories } from "./categories-provider";

interface CategoriesDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CategoriesDeleteDialog({
  open,
  onOpenChange,
}: CategoriesDeleteDialogProps) {
  const { handleDelete, currentCategory } = useCategories();

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Hapus Kategori"
      desc={`Apakah Anda yakin ingin menghapus kategori "${currentCategory?.name}" ini? Tindakan ini tidak dapat dibatalkan.`}
      confirmText="Hapus"
      destructive
      handleConfirm={handleDelete}
      className="sm:max-w-sm"
    />
  );
}
