import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import type {
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
} from "@tanstack/react-table";

type UseTableUrlStateParams = {
  pagination?: {
    pageKey?: string;
    pageSizeKey?: string;
    defaultPage?: number;
    defaultPageSize?: number;
  };
  globalFilter?: {
    enabled?: boolean;
    key?: string;
    trim?: boolean;
  };
  columnFilters?: Array<
    | {
        columnId: string;
        searchKey: string;
        type?: "string";
        serialize?: (value: unknown) => unknown;
        deserialize?: (value: unknown) => unknown;
      }
    | {
        columnId: string;
        searchKey: string;
        type: "array";
        serialize?: (value: unknown) => unknown;
        deserialize?: (value: unknown) => unknown;
      }
  >;
};

type UrlQueryPrimitive = string | number | boolean;

type UrlQueryValue =
  | UrlQueryPrimitive
  | readonly UrlQueryPrimitive[]
  | null
  | undefined;

type UrlQuery = Record<string, UrlQueryValue>;

const toUrlValue = (v: unknown): UrlQueryValue => {
  if (
    typeof v === "string" ||
    typeof v === "number" ||
    typeof v === "boolean"
  ) {
    return v;
  }

  return undefined;
};

export function useTableUrlState(params: UseTableUrlStateParams) {
  const router = useRouter();
  const search = router.query;

  const {
    pagination: paginationCfg,
    globalFilter: globalFilterCfg,
    columnFilters: columnFiltersCfg = [],
  } = params;

  const pageKey = paginationCfg?.pageKey ?? "page";
  const pageSizeKey = paginationCfg?.pageSizeKey ?? "pageSize";
  const defaultPage = paginationCfg?.defaultPage ?? 1;
  const defaultPageSize = paginationCfg?.defaultPageSize ?? 10;

  const globalFilterKey = globalFilterCfg?.key ?? "filter";
  const globalFilterEnabled = globalFilterCfg?.enabled ?? true;
  const trimGlobal = globalFilterCfg?.trim ?? true;

  const navigate = ({
    search,
    replace,
  }: {
    search: UrlQuery | ((prev: UrlQuery) => UrlQuery);
    replace?: boolean;
  }) => {
    const prevQuery = router.query as UrlQuery;

    const nextQuery = typeof search === "function" ? search(prevQuery) : search;

    const sanitizedQuery: UrlQuery = Object.fromEntries(
      Object.entries(nextQuery).filter(([, value]) => {
        if (value === undefined) return false;
        if (Array.isArray(value)) return value.length > 0;
        return true;
      }),
    );

    const fn = replace ? router.replace : router.push;

    void fn(
      {
        pathname: router.pathname,
        query: sanitizedQuery,
      },
      undefined,
      { shallow: true },
    );
  };

  // ---------- Column filters ----------
  const initialColumnFilters: ColumnFiltersState = useMemo(() => {
    const collected: ColumnFiltersState = [];

    for (const cfg of columnFiltersCfg) {
      const raw = search[cfg.searchKey];
      const deserialize = cfg.deserialize ?? ((v) => v);

      if (cfg.type === "string") {
        if (typeof raw === "string" && raw.trim()) {
          collected.push({
            id: cfg.columnId,
            value: deserialize(raw),
          });
        }
      } else {
        const value = Array.isArray(raw)
          ? raw
          : typeof raw === "string"
            ? [raw]
            : [];

        if (value.length) {
          collected.push({
            id: cfg.columnId,
            value: deserialize(value),
          });
        }
      }
    }

    return collected;
  }, [columnFiltersCfg, search]);

  const [columnFilters, setColumnFilters] =
    useState<ColumnFiltersState>(initialColumnFilters);

  // useEffect(() => {
  //   setColumnFilters(initialColumnFilters);
  // }, [initialColumnFilters]);

  // ---------- Pagination ----------
  const pagination: PaginationState = useMemo(() => {
    const page = Number(search[pageKey] ?? defaultPage);
    const pageSize = Number(search[pageSizeKey] ?? defaultPageSize);

    return {
      pageIndex: Math.max(0, page - 1),
      pageSize,
    };
  }, [search, pageKey, pageSizeKey, defaultPage, defaultPageSize]);

  const onPaginationChange: OnChangeFn<PaginationState> = (updater) => {
    const next = typeof updater === "function" ? updater(pagination) : updater;

    const nextPage = next.pageIndex + 1;
    const nextPageSize = next.pageSize;

    console.log("onPaginationChange", next);
    navigate({
      search: (prev) => ({
        ...prev,
        [pageKey]: nextPage <= defaultPage ? undefined : nextPage,
        [pageSizeKey]:
          nextPageSize === defaultPageSize ? undefined : nextPageSize,
      }),
    });
  };

  // ---------- Global filter ----------
  const [globalFilter, setGlobalFilter] = useState(() => {
    if (!globalFilterEnabled) return "";
    return typeof search[globalFilterKey] === "string"
      ? search[globalFilterKey]
      : "";
  });

  const onGlobalFilterChange: OnChangeFn<string> | undefined =
    globalFilterEnabled
      ? (updater) => {
          const next =
            typeof updater === "function" ? updater(globalFilter) : updater;

          const value = trimGlobal ? next.trim() : next;
          setGlobalFilter(value);

          console.log("onGlobalFilterChange", value);
          navigate({
            search: (prev) => ({
              ...prev,
              [pageKey]: undefined,
              [globalFilterKey]: value || undefined,
            }),
          });
        }
      : undefined;

  // ---------- Column filters handler ----------
  const onColumnFiltersChange: OnChangeFn<ColumnFiltersState> = (updater) => {
    const next =
      typeof updater === "function" ? updater(columnFilters) : updater;

    setColumnFilters(next);

    const patch: UrlQuery = {};

    for (const cfg of columnFiltersCfg) {
      const found = next.find((f) => f.id === cfg.columnId);
      const serialize = cfg.serialize ?? ((v) => v);

      if (cfg.type === "string") {
        const value =
          typeof found?.value === "string" ? found.value.trim() : "";
        patch[cfg.searchKey] = value ? toUrlValue(serialize(value)) : undefined;
      } else {
        const value = Array.isArray(found?.value) ? found.value : [];
        patch[cfg.searchKey] =
          value.length > 0 ? toUrlValue(serialize(value)) : undefined;
      }
    }

    console.log("onColumnFiltersChange", { columnFiltersCfg, patch, next });
    navigate({
      search: (prev) => ({
        ...prev,
        [pageKey]: undefined, // reset pagination
        ...patch,
      }),
    });
  };

  const ensurePageInRange = (pageCount: number) => {
    const page = Number(search[pageKey] ?? defaultPage);

    console.log("ensurePageInRange", { page, pageCount });
    if (pageCount > 0 && page > pageCount) {
      navigate({
        replace: true,
        search: (prev) => ({
          ...prev,
          [pageKey]: undefined,
        }),
      });
    }
  };

  return {
    globalFilter,
    onGlobalFilterChange,
    columnFilters,
    onColumnFiltersChange,
    pagination,
    onPaginationChange,
    ensurePageInRange,
  };
}
