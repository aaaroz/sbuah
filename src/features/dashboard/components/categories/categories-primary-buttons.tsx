import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCategories } from "./categories-provider";

export const CategoriesPrimaryButtons = () => {
  const { setDialogOpen, setCurrentCategory } = useCategories();
  return (
    <div className="flex gap-2">
      <Button
        className="space-x-1"
        onClick={() => {
          setCurrentCategory(null);
          setDialogOpen("create");
        }}
      >
        <Plus size={18} />
        <span>Tambah</span>
      </Button>
    </div>
  );
};
