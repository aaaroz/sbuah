import { create } from "zustand";
import { type RouterOutputs } from "../utils/api";

type Product = RouterOutputs["product"]["getAll"]["items"][number];
type Pagination = RouterOutputs["product"]["getAll"]["pagination"];

interface ProductStore {
  products: Product[];
  pagination: Pagination | null;

  loading: boolean;
  error: string | null;

  // actions
  setProducts: (products: Product[]) => void;
  setPagination: (pagination: Pagination | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  pagination: null,

  loading: false,
  error: null,

  // Setters
  setProducts: (products) => set({ products }),
  setPagination: (pagination) => set({ pagination }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
