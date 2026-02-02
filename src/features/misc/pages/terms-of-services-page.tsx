import { ImageHeader } from "@/components/layouts/image-header";
import * as React from "react";
import { TermsOfServicesContent } from "../components/terms-of-services-content";
import { HeadMetaData } from "@/components/commons/head-meta-data";
import { LandingPageLayout } from "@/components/layouts/landing-page-layout";

const TermsOfServicesPage = () => {
  return (
    <LandingPageLayout>
      <HeadMetaData title="Syarat & Ketentuan" />
      <div className="mt-4 flex flex-col gap-14 md:gap-16">
        <ImageHeader imageUrl="/tos.png" />
        <TermsOfServicesContent />
      </div>
    </LandingPageLayout>
  );
};
export default TermsOfServicesPage;
