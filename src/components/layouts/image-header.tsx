import * as React from "react";
import Image from "next/image";

interface ImageHeaderProps {
    imageUrl: string;
    isMenuPage?: boolean;
};

export const ImageHeader: React.FC<ImageHeaderProps> = ({ imageUrl, isMenuPage = false }) => {
    if (isMenuPage)
        return (
            <div className="relative">
                <Image
                    src={imageUrl}
                    alt="header-image"
                    width={1000}
                    height={1000}
                    className="w-full h-72 object-cover object-center rounded-2xl"
                    priority
                />
                <span className="bg-rose-500 absolute -top-5 left-8 md:left-10 px-8 py-2 rounded-xl text-white font-semibold">
                    Menu Unggulan
                </span>
            </div>
        );
    return (
        <Image
            src={imageUrl}
            alt="header-image"
            width={1000}
            height={1000}
            className="w-full h-72 object-cover object-center rounded-2xl"
            priority
        />
    );
};
