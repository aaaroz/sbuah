import { ChevronLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface ProductsPrimaryButtonsProps {
  isFormPage?: boolean;
}
export function ProductsPrimaryButtons({
  isFormPage = false,
}: ProductsPrimaryButtonsProps) {
  if (isFormPage) {
    return (
      <div className="flex gap-2">
        <Link href="/dashboard/products">
          <Button className="space-x-1" variant="outline">
            <ChevronLeft size={18} />
            <span>Kembali</span>
          </Button>
        </Link>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <Link href="/dashboard/products/new">
        <Button className="space-x-1">
          <Plus size={18} />
          <span>Tambah</span>
        </Button>
      </Link>
    </div>
  );
}
