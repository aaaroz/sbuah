import * as React from "react";
import { LandingPageLayout } from "@/components/layouts/landing-page-layout";
import { ImageHeader } from "@/components/layouts/image-header";
import { HeadMetaData } from "@/components/commons/head-meta-data";
import { CartWrapper } from "../components/cart-wrapper";

const CartPage = () => {
    return (
        <LandingPageLayout>
            <HeadMetaData title="Keranjang Belanja" />
            <div className="container flex flex-col gap-14 md:gap-16 mt-4">
                <ImageHeader imageUrl="/keranjang.png" />
                <CartWrapper />
            </div>
        </LandingPageLayout>
    );
};

export default CartPage;
