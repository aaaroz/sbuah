import * as React from "react";
import Image from "next/image";
import { LandingPageLayout } from "@/components/layouts/landing-page-layout";
import { HeroSection } from "../components/hero-section";
import { WelcomeSection } from "../components/welcome-section";
import { QuestionSection } from "../components/question-section";
import { CtaSection } from "../components/cta-section";
import { HeadMetaData } from "@/components/commons/head-meta-data";

const LandingPage = () => {
    return (
        <LandingPageLayout>
            <HeadMetaData />
            <div className="flex flex-col gap-14 md:gap-16">
                <HeroSection />
                <WelcomeSection />
                <QuestionSection />
                <div className="flex justify-center">
                    <Image
                        src="/logo-s.png"
                        alt="S'BUAH"
                        width={200}
                        height={200}
                        className="h-auto w-auto max-w-11 md:max-w-16"
                    />
                </div>
                <CtaSection />
            </div>
        </LandingPageLayout>
    );
};

export default LandingPage;
