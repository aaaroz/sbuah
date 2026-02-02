import { ImageHeader } from "@/components/layouts/image-header";
import * as React from "react";
import { GuideAndFAQContent } from "../components/guide-and-faq-content";
import { GuideAndFAQOtherQuestion } from "../components/guide-and-faq-other-question";
import { LandingPageLayout } from "@/components/layouts/landing-page-layout";
import { HeadMetaData } from "@/components/commons/head-meta-data";

const GuideAndFAQPage = () => {
  return (
    <LandingPageLayout>
      <HeadMetaData title="Petunjuk & Pertanyaan" />
      <div className="mt-4 flex flex-col gap-14 md:gap-16">
        <ImageHeader imageUrl="/faq.png" />
        <GuideAndFAQContent />
        <GuideAndFAQOtherQuestion />
      </div>
    </LandingPageLayout>
  );
};
export default GuideAndFAQPage;
