import * as React from "react";
import { LandingPageLayout } from "@/components/layouts/landing-page-layout";
import { ImageHeader } from "@/components/layouts/image-header";
import { MenuFilter } from "../components/menu-filter";
import { MenuWrapper } from "../components/menu-wrapper";
import { MenuCart } from "../components/menu-cart";
import { HeadMetaData } from "@/components/commons/head-meta-data";

const MenuPage = () => {
  return (
    <LandingPageLayout>
      <HeadMetaData title="Menu Spesial" />
      <div className="mt-4 flex flex-col gap-14 md:gap-16">
        <ImageHeader imageUrl="/menu.png" isMenuPage />
        <MenuFilter />
        <MenuWrapper />
        <MenuCart />
      </div>
    </LandingPageLayout>
  );
};

export default MenuPage;
