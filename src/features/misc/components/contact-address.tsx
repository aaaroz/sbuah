import Link from "next/link";
import { ContactMap } from "./contact-map";

export const ContactAddress = () => {
  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      <div className="flex flex-col gap-2 rounded-2xl bg-rose-950 p-9 text-white">
        <h1 className="text-xl font-bold md:text-3xl">
          Outlet Sop Buah Ibu Popon
        </h1>
        <p>
          79W2+68M, Jl. Cirata, Ciroyom, Kecamatan Cipeundeuy, Kabupaten Bandung
          Barat, Jawa Barat 40558
        </p>
        <Link href="#" as="#">
          Phone 1 : (021) 78885759
        </Link>
        <Link href="#" as="#">
          Whatsapp : 081213294383
        </Link>
      </div>
      <ContactMap />
    </div>
  );
};
