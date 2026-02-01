import { create } from "zustand";
import { type RouterOutputs } from "../utils/api";
import { type Product } from "../types/product";
import { Category } from "../types/category";

type Pagination = RouterOutputs["product"]["getAll"]["pagination"];

interface ProductStore {
  products: Product[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
  selectedCategory: Category | null;
  searchQuery: string | null;

  //setters
  setProducts: (products: Product[]) => void;
  setPagination: (pagination: Pagination | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSelectedCategory: (category: Category | null) => void;
  setSearchQuery: (searchQuery: string | null) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  products: [],
  pagination: null,
  loading: false,
  error: null,
  selectedCategory: null,
  searchQuery: null,

  // Setters
  setProducts: (products) => set({ products }),
  setPagination: (pagination) => set({ pagination }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setSelectedCategory: (selectedCategory) => set({ selectedCategory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
}));
