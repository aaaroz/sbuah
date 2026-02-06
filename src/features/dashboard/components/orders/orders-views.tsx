"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  ArrowDownAZ,
  ArrowUpAZ,
  CalendarIcon,
  Check,
  Filter,
  Loader2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { api } from "@/lib/utils";
import { OrdersCard } from "./orders-card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { type orderStatusMap } from "@/lib/data/order";
import { type DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Field } from "@/components/ui/field";
import { Calendar } from "@/components/ui/calendar";
import { id } from "date-fns/locale";
import { Ribbon } from "@/components/ui/ribbon";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";

const STATUS_OPTIONS = [
  { label: "Menunggu", value: "PENDING" },
  { label: "Diproses", value: "ON_PROCESS" },
  { label: "Selesai", value: "COMPLETED" },
  { label: "Dibatalkan", value: "CANCELLED" },
] as const;

export const OrdersViews = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState<"asc" | "desc">("desc");
  const [status, setStatus] = useState<(keyof typeof orderStatusMap)[]>([]);
  const [date, setDate] = useState<DateRange | undefined>(undefined);

  const loadMoreRef = useRef<HTMLLIElement | null>(null);

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    api.order.getAll.useInfiniteQuery(
      {
        limit: 12,
        status: status.length > 0 ? status : undefined,
        dateFrom: date?.from,
        dateTo: date?.to,
        sort,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );

  // Flatten pages
  const orders = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  // Client-side search
  const filteredOrders = useMemo(() => {
    return orders.filter((order) =>
      `${order.orderNumber} ${order.buyerName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );
  }, [orders, searchTerm]);

  // Intersection Observer
  useIsomorphicLayoutEffect(() => {
    if (!hasNextPage || !loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void fetchNextPage();
        }
      },
      { rootMargin: "100px" },
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  return (
    <>
      {/* Header */}
      <div className="my-4 flex items-end justify-between sm:items-center">
        <div className="flex flex-row flex-wrap gap-2 sm:items-center">
          <Input
            placeholder="Cari order number / pembeli..."
            className="h-9 w-40 lg:w-62.5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Filter size={14} />
                Status
                {status.length > 0 && (
                  <span className="bg-primary rounded px-1.5 text-xs">
                    {status.length}
                  </span>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-48 p-0" align="start">
              <Command>
                <CommandGroup>
                  {STATUS_OPTIONS.map((option) => {
                    const isSelected = status.includes(option.value);

                    return (
                      <CommandItem
                        key={option.value}
                        onSelect={() => {
                          setStatus((prev) =>
                            isSelected
                              ? prev.filter((s) => s !== option.value)
                              : [...prev, option.value],
                          );
                        }}
                        className="flex items-center justify-between"
                      >
                        <span>{option.label}</span>
                        {isSelected && <Check size={16} />}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <Field className="w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  id="date-picker-range"
                  className="justify-start px-2.5 font-normal"
                >
                  <CalendarIcon />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} -{" "}
                        {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pilih periode tanggal</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                  locale={id}
                />
              </PopoverContent>
            </Popover>
          </Field>
          {(status.length > 0 || date) && (
            <Button
              variant="ghost"
              onClick={() => {
                setStatus([]);
                setDate(undefined);
              }}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <Select
          value={sort}
          onValueChange={(v) => setSort(v as "asc" | "desc")}
        >
          <SelectTrigger className="w-16">
            <SelectValue>
              <SlidersHorizontal size={18} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent align="end">
            <SelectItem value="asc">
              <div className="flex items-center gap-4">
                <ArrowUpAZ size={16} />
                <span>Terlama</span>
              </div>
            </SelectItem>
            <SelectItem value="desc">
              <div className="flex items-center gap-4">
                <ArrowDownAZ size={16} />
                <span>Terbaru</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="shadow-xs" />

      {/* List */}
      <ul className="faded-bottom no-scrollbar grid gap-4 overflow-auto pt-4 pb-16 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <li className="text-muted-foreground flex items-center justify-center gap-2 text-sm md:col-span-2 lg:col-span-3">
            <Loader2 className="animate-spin" />
            Mengambil order…
          </li>
        ) : filteredOrders.length === 0 ? (
          <li className="text-muted-foreground flex items-center justify-center gap-2 text-sm md:col-span-2 lg:col-span-3">
            Belum ada order.
          </li>
        ) : (
          <>
            {filteredOrders.map(
              ({
                id,
                orderNumber,
                totalAmount,
                buyerName,
                phoneNumber,
                status,
                isPaid,
                proofImageUrl,
                createdAt,
                items,
              }) => (
                <div key={id} className="relative p-1">
                  {!isPaid && proofImageUrl && (
                    <Ribbon
                      text="Cek Bukti"
                      className="before:bg-amber-500 after:bg-amber-500"
                      childClassName="bg-amber-400"
                    />
                  )}
                  {isPaid && (
                    <Ribbon
                      text="Dibayar"
                      className="before:bg-emerald-500 after:bg-emerald-500"
                      childClassName="bg-emerald-400"
                    />
                  )}
                  <OrdersCard
                    orderId={id}
                    phoneNumber={phoneNumber}
                    orderNumber={orderNumber}
                    buyerName={buyerName}
                    totalAmount={Number(totalAmount)}
                    status={status}
                    isPaid={isPaid}
                    createdAt={createdAt}
                    items={items}
                  />
                </div>
              ),
            )}

            {/* Infinite scroll trigger */}
            {hasNextPage && (
              <li
                ref={loadMoreRef}
                className="text-muted-foreground flex items-center justify-center gap-2 text-sm md:col-span-2 lg:col-span-3"
              >
                {isFetchingNextPage && (
                  <>
                    <Loader2 className="animate-spin" />
                    Memuat lebih banyak…
                  </>
                )}
              </li>
            )}
          </>
        )}
      </ul>
    </>
  );
};
