import Image from "next/image";
import * as React from "react";

type Props = {
  title: string;
  isAuth?: boolean;
};

export const HeaderCircle = ({ title, isAuth }: Props) => {
  if (isAuth)
    return (
      <div className="flex flex-col gap-4">
        <Image
          src="/duo-fruits-2.png"
          alt="duo-fruits"
          width={230}
          height={230}
          className="mx-auto min-h-20 w-auto"
        />
        <h1 className="text-center text-xl font-bold md:text-4xl">{title}</h1>
      </div>
    );
  return (
    <div className="flex flex-col gap-8">
      <Image
        src="/duo-fruits.png"
        alt="duo-fruits"
        width={230}
        height={230}
        className="mx-auto min-h-32 w-auto"
      />
      <h1 className="text-center text-xl font-bold md:text-4xl">{title}</h1>
    </div>
  );
};
