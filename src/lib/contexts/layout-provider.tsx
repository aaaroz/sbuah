"use client";

import { createContext, useContext, useState } from "react";
import Cookies from "js-cookie";

export type Collapsible = "offcanvas" | "icon" | "none";
export type Variant = "inset" | "sidebar" | "floating";

const LAYOUT_COLLAPSIBLE_COOKIE_NAME = "layout_collapsible";
const LAYOUT_VARIANT_COOKIE_NAME = "layout_variant";
const LAYOUT_COOKIE_MAX_AGE = 7; // days (js-cookie uses days)

const DEFAULT_VARIANT: Variant = "inset";
const DEFAULT_COLLAPSIBLE: Collapsible = "icon";

type LayoutContextType = {
  resetLayout: () => void;

  defaultCollapsible: Collapsible;
  collapsible: Collapsible;
  setCollapsible: (collapsible: Collapsible) => void;

  defaultVariant: Variant;
  variant: Variant;
  setVariant: (variant: Variant) => void;
};

const LayoutContext = createContext<LayoutContextType | null>(null);

type LayoutProviderProps = {
  children: React.ReactNode;
};

export function LayoutProvider({ children }: LayoutProviderProps) {
  const [collapsible, setCollapsibleState] = useState<Collapsible>(() => {
    const saved = Cookies.get(LAYOUT_COLLAPSIBLE_COOKIE_NAME);
    return (saved as Collapsible) ?? DEFAULT_COLLAPSIBLE;
  });

  const [variant, setVariantState] = useState<Variant>(() => {
    const saved = Cookies.get(LAYOUT_VARIANT_COOKIE_NAME);
    return (saved as Variant) ?? DEFAULT_VARIANT;
  });

  const setCollapsible = (value: Collapsible) => {
    setCollapsibleState(value);
    Cookies.set(LAYOUT_COLLAPSIBLE_COOKIE_NAME, value, {
      expires: LAYOUT_COOKIE_MAX_AGE,
    });
  };

  const setVariant = (value: Variant) => {
    setVariantState(value);
    Cookies.set(LAYOUT_VARIANT_COOKIE_NAME, value, {
      expires: LAYOUT_COOKIE_MAX_AGE,
    });
  };

  const resetLayout = () => {
    setCollapsibleState(DEFAULT_COLLAPSIBLE);
    setVariantState(DEFAULT_VARIANT);

    Cookies.remove(LAYOUT_COLLAPSIBLE_COOKIE_NAME);
    Cookies.remove(LAYOUT_VARIANT_COOKIE_NAME);
  };

  return (
    <LayoutContext.Provider
      value={{
        resetLayout,
        defaultCollapsible: DEFAULT_COLLAPSIBLE,
        collapsible,
        setCollapsible,
        defaultVariant: DEFAULT_VARIANT,
        variant,
        setVariant,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

// Hook
export function useLayout() {
  const context = useContext(LayoutContext);
  if (!context) {
    throw new Error("useLayout must be used within a LayoutProvider");
  }
  return context;
}
