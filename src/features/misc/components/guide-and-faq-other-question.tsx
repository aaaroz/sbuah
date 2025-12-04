import * as React from "react";
import { Mail } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const GuideAndFAQOtherQuestion = () => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-rose-700 px-6 py-8 text-white">
      <h2 className="text-lg font-bold md:text-xl">Punya Pertanyaan Lain?</h2>
      <Button className="hover:bg-rose-600/80" asChild>
        <Link href="mailto:ram.ardiansyah18@gmail.com">
          <Mail className="mr-3 h-5 w-5" /> Hubungi Email Kami!
        </Link>
      </Button>
    </div>
  );
};
