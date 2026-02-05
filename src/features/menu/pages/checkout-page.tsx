import * as React from "react";
import { CheckoutForm } from "../components/checkout-form";
import { HeaderCircle } from "@/components/layouts/header-circle";
import { HeadMetaData } from "@/components/commons/head-meta-data";
import { LandingPageLayout } from "@/components/layouts/landing-page-layout";

const CheckoutPage = () => {
  return (
    <LandingPageLayout>
      <HeadMetaData title="Checkout Pesanan" />
      <div className="mt-4 flex flex-col gap-14 md:gap-16">
        <HeaderCircle title="Checkout Pesanan" />
        <CheckoutForm />
      </div>
    </LandingPageLayout>
  );
};

export default CheckoutPage;
