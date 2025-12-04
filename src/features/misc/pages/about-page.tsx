import * as React from "react";
import { AboutContent } from "../components/about-content";
import { AboutCTA } from "../components/about-cta";
import { ImageHeader } from "@/components/layouts/image-header";
import { HeadMetaData } from "@/components/commons/head-meta-data";
import { LandingPageLayout } from "@/components/layouts/landing-page-layout";

const AboutPage = () => {
  return (
    <LandingPageLayout>
      <HeadMetaData title="Tentang Kami" />
      <div className="container mt-4 flex flex-col gap-14 md:gap-16">
        <ImageHeader imageUrl="/about-us.png" />
        <AboutContent />
        <AboutCTA />
      </div>
    </LandingPageLayout>
  );
};

export default AboutPage;
