import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import * as React from "react";

const faqs = [
  {
    question: "Apa itu S'BUAH?",
    answer:
      "S'BUAH adalah platform yang menyediakan beberapa macam minuman buah-buahan, dengan S'BUAH kalian bisa memesan menu dari warung SOP BUAH IBU POPON, dengan cara yang praktis dan tanpa antri.",
  },
  {
    question: "Bagaimana cara memesan di S'BUAH?",
    answer:
      "Masuk ke halaman menu, lalu tambahkan menu favoritmu kedalam keranjang dan lakukan pemesanan.",
  },
  {
    question: "Bagaimana cara mengambil pesanan dari S'BUAH?",
    answer:
      "Jika anda memilih metode pemesanan 'Pick Up', maka anda harus mengambilnya sendiri di outlet Warung Sop Buah Ibu Popon. Jika anda memilih metode pemesanan 'Delivery', maka anda hanya perlu menunggu pesanan dirumah anda, biar kami yang antarkan pesananmu.",
  },
];
export const GuideAndFAQContent = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-xl font-bold text-rose-950 dark:text-foreground md:text-2xl">
        Pertanyaan Yang Sering Ditanyakan
      </h1>
      <div className="rounded-2xl bg-rose-950 px-6 py-8">
        <Accordion type="single" collapsible>
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="text-white">
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};
