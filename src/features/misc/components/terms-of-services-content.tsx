import * as React from "react";

const termsOfServices = [
  {
    title: "Pembelian:",
    content: [
      "Dengan melakukan pembelian, Anda mengkonfirmasi bahwa Anda telah menyetujui terhadap pembelian tersebut.",
      "Pesanan dapat tunduk pada ketersediaan stok. Kami berhak untuk menolak atau membatalkan pesanan jika diperlukan.",
    ],
  },
  {
    title: "Harga dan Pembayaran:",
    content: [
      "Harga produk yang tercantum di website kami bersifat netto dan dapat berubah tanpa pemberitahuan sebelumnya.",
      "Pembayaran harus dilakukan pada saat pemesanan melalui metode pembayaran yang telah tersedia di website kami.",
    ],
  },
  {
    title: "Pengiriman:",
    content: [
      "Kami akan berusaha untuk mengirim pesanan anda sesuai dengan estimasi waktu pengiriman yang tercantum.",
      "Kami tidak bertanggung jawab atas keterlambatan pengiriman yang disebabkan oleh keadaan di luar kendali kami.",
    ],
  },
  {
    title: "Pengembalian dan Penggantian:",
    content: [
      "Pengembalian atau penggantian produk hanya akan diproses jika produk yang diterima tidak sesuai dengan deskripsi atau basi.",
      "Untuk mengajukan pengembalian atau penggantian, harap hubungi tim layanan pelanggan kami dalam waktu 48 jam setelah menerima pesanan.",
    ],
  },
  {
    title: "Privasi dan Kebijakan Keamanan:",
    content: [
      "Kami menghargai privasi Anda dan akan menjaga keamanan informasi pribadi Anda sesuai dengan kebijakan privasi kami.",
    ],
  },
  {
    title: "Perubahan Syarat dan Ketentuan:",
    content: [
      "Kami berhak untuk mengubah syarat dan ketentuan ini kapan saja tanpa pemberitahuan sebelumnya. Perubahan tersebut akan mulai berlaku sejak tanggal mereka diposting di website kami.",
    ],
  },
];
export const TermsOfServicesContent = () => {
  return (
    <div className="space-y-4 text-rose-950 dark:text-foreground">
      <h1 className="text-xl font-bold md:text-2xl">
        Selamat Datang Penikmat S{"'"}BUAH!
      </h1>
      <p className="text-sm">
        Dengan melakukan pembelian melalui website kami, Anda setuju untuk
        mematuhi dan terikat oleh syarat dan ketentuan berikut:
      </p>
      <ul className="list-inside list-decimal space-y-4 text-lg font-bold md:text-xl">
        {termsOfServices.map((tos, i) => (
          <li key={i}>
            {tos.title}
            <ul className="mt-2 list-inside list-disc space-y-1 pl-5 text-sm font-normal">
              {tos.content.map((content, i) => (
                <li key={i}>{content}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className="text-sm">
        Dengan melanjutkan pembelian, Anda menyatakan bahwa Anda telah membaca,
        memahami, dan menyetujui syarat dan ketentuan ini sepenuhnya. Jika Anda
        memiliki pertanyaan atau kekhawatiran, jangan ragu untuk menghubungi tim
        layanan pelanggan kami.
      </p>
      <p className="text-sm">
        Terima kasih atas kepercayaan Anda dalam memesan dari Warung Sop Buah
        Ibu Popon melalui layanan pemesanan online kami!
      </p>
    </div>
  );
};
