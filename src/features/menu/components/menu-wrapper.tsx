import * as React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { MenuCard } from "@/components/commons/menu-card";

export const MenuWrapper = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {Array(9)
          .fill(0)
          .map((item: number) => (
            <MenuCard
              key={item}
              imageUrl="/sop-buah-menu.webp"
              title="Sop Buah Spesial"
              description="Campuran buah-buahan yang di mix dengan susu menghasilkan rasa yang manis dan segar"
              rating={5}
              reviews={99}
              price={10000}
            />
          ))}
      </div>
      <Pagination>
        <PaginationContent className="space-x-1.5">
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#" isActive>
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
};
