import * as React from "react";
import { HeadMetaData } from "@/components/commons/head-meta-data";
import { ContactAddress } from "../components/contact-address";
import { ImageHeader } from "@/components/layouts/image-header";
import { LandingPageLayout } from "@/components/layouts/landing-page-layout";
import { ContactForm } from "../components/contact-form";

const ContactPage = () => {
  return (
    <LandingPageLayout>
      <HeadMetaData title="Kontak Kami" />
      <div className="mt-4 flex flex-col gap-14 md:gap-16">
        <ImageHeader imageUrl="/contact-us.png" />
        <ContactAddress />
        <ContactForm />
      </div>
    </LandingPageLayout>
  );
};

export default ContactPage;
