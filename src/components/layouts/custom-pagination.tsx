"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

interface CustomPaginationProps {
  currentPage: number;
  lastPage?: number;
  pageNumberLimit: number;
}

export const CustomPagination: React.FC<CustomPaginationProps> = ({
  currentPage,
  lastPage,
  pageNumberLimit,
}) => {
  const searchParams = useSearchParams();

  const createPageHref = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(page));
    return `?${params.toString()}`;
  };

  const pages = Array.from({ length: lastPage ?? 0 }, (_, i) => i + 1);
  const totalPages = pages.length;

  const halfLimit = Math.floor(pageNumberLimit / 2);
  const maxPageNumberLimit = Math.min(
    totalPages,
    Math.max(pageNumberLimit, currentPage + halfLimit),
  );
  const minPageNumberLimit = Math.max(
    1,
    maxPageNumberLimit - pageNumberLimit + 1,
  );

  return (
    <Pagination className="flex justify-center py-8">
      <PaginationContent>
        <PaginationPrevious
          href={createPageHref(Math.max(1, currentPage - 1))}
          className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
        />

        {minPageNumberLimit > 1 && (
          <PaginationItem>
            <Link href={createPageHref(Math.max(1, currentPage - 5))}>
              <PaginationEllipsis />
            </Link>
          </PaginationItem>
        )}

        {pages
          .filter((p) => p >= minPageNumberLimit && p <= maxPageNumberLimit)
          .map((page) => (
            <PaginationLink
              key={page}
              href={createPageHref(page)}
              isActive={currentPage === page}
              className={cn(
                "hidden md:flex",
                currentPage === page
                  ? "border-primary pointer-events-none border"
                  : "hover:bg-neutral-200 dark:hover:bg-neutral-900",
              )}
            >
              {page}
            </PaginationLink>
          ))}

        {maxPageNumberLimit < totalPages && (
          <PaginationItem>
            <Link href={createPageHref(Math.min(totalPages, currentPage + 5))}>
              <PaginationEllipsis />
            </Link>
          </PaginationItem>
        )}

        <PaginationNext
          href={createPageHref(Math.min(totalPages, currentPage + 1))}
          className={cn(
            currentPage === totalPages && "pointer-events-none opacity-50",
          )}
        />
      </PaginationContent>
    </Pagination>
  );
};
