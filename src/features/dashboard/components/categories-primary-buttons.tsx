import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const CategoriesPrimaryButtons = () => {
  return (
    <div className="flex gap-2">
      <Button className="space-x-1">
        <Plus size={18} />
        <span>Tambah</span>
      </Button>
    </div>
  );
};
