import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LandingPageLayout } from "@/components/layouts/landing-page-layout";
import { api } from "@/lib/utils";
import { useRouter } from "next/router";
import { orderStatusMap } from "@/lib/data/order";
import { HeadMetaData } from "@/components/commons/head-meta-data";
import { Copy, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { toast } from "sonner";
import { Ribbon } from "@/components/ui/ribbon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

const isTerminal = (status: string) =>
  status === "CANCELLED" || status === "COMPLETED";

export default function OrderDetailPage() {
  const router = useRouter();

  const {
    query: { id },
  } = router;

  const { data: order, isLoading } = api.order.getOne.useQuery(
    { id: id as string },
    {
      enabled: typeof id === "string" && id !== "new",
      refetchInterval: (query) => {
        const data = query.state.data;
        if (!data) return false;

        return isTerminal(data.status) ? false : 5000;
      },
      refetchOnWindowFocus: true,
    },
  );

  const statusConfig = orderStatusMap[order?.status ?? "PENDING"];

  const copyOrderLink = async (orderId: string, isLink: boolean) => {
    if (!isLink) {
      toast.promise(navigator.clipboard.writeText(orderId), {
        loading: "Menyalin Order ID...",
        success: "Order ID berhasil disalin",
        error: "Gagal menyalin Order ID",
      });
    }
    const url = `${window.location.origin}/orders/${orderId}`;
    toast.promise(navigator.clipboard.writeText(url), {
      loading: "Menyalin Order Link...",
      success: "Order Link berhasil disalin",
      error: "Gagal menyalin Order Link",
    });
  };

  if (!order || (!order && isLoading)) {
    return <OrderDetailSkeleton />;
  }

  return (
    <LandingPageLayout>
      <HeadMetaData title="Detail Pesananmu" />

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-semibold">Detail Pesananmu</h1>
          <div className="flex flex-wrap items-center gap-2">
            <Tooltip>
              <TooltipTrigger>
                <Badge variant={statusConfig.variant}>
                  {statusConfig.label}
                </Badge>
              </TooltipTrigger>
              <TooltipContent>{statusConfig.description}</TooltipContent>
            </Tooltip>
            <p className="text-muted-foreground text-sm">
              Order ID: <span className="font-mono">{order.id}</span>
            </p>

            <Button
              variant="outline"
              size="icon"
              onClick={() => copyOrderLink(order.id, false)}
            >
              <Copy />
            </Button>
          </div>
        </div>

        {/* Order Meta */}
        <Card className="m-1">
          <CardHeader>
            <CardTitle>Informasi Pesanan</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Nama Pembeli" value={order.buyerName} />
            <Field label="Email" value={order.email ?? "-"} />
            <Field label="No. Telepon" value={order.phoneNumber} />
            <Field label="Alamat" value={order.address ?? "-"} />
            <Field label="Metode Pembayaran" value={order.paymentMethod} />
            <Field label="Metode Pembelian" value={order.purchaseMethod} />
            <Field label="Catatan Pesanan" value={order.note ?? "-"} full />
            <Field
              label="Dibuat Pada"
              value={`${new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Jakarta",
              }).format(new Date(order.createdAt))} WIB`}
            />
            <Field
              label="Terakhir Diupdate"
              value={`${new Intl.DateTimeFormat("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                timeZone: "Asia/Jakarta",
              }).format(new Date(order.updatedAt))} WIB`}
            />
          </CardContent>
        </Card>

        {/* Items */}
        <Card className="m-1">
          <CardHeader>
            <CardTitle>Item Pesanan</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produk</TableHead>
                  <TableHead>Harga</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Subtotal</TableHead>
                  <TableHead>Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {order.items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>{item.price.toString()}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>
                      {(Number(item.price) * item.quantity).toString()}
                    </TableCell>
                    <TableCell>{item.note ?? "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Summary */}
        <div className="relative p-1">
          {order.isPaid && (
            <Ribbon
              text="Lunas"
              className="before:bg-emerald-500 after:bg-emerald-500"
              childClassName="bg-emerald-400"
            />
          )}
          <Card className="relative z-10">
            <CardHeader>
              <CardTitle>Ringkasan Pembayaran</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Row
                label="Subtotal"
                value={new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(Number(order.subtotal))}
                strong
              />
              <Separator />
              <Row
                label="Total Pembayaran"
                value={new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  maximumFractionDigits: 0,
                }).format(Number(order.totalAmount))}
                strong
              />
            </CardContent>
          </Card>
        </div>

        <Alert className="m-1 mr-2">
          <AlertTitle>
            Jangan keluar dari halaman ini sebelum pesananmu selesai
          </AlertTitle>
          <AlertDescription>
            Klik tombol di samping kanan untuk meng-copy link detail pesananmu.
            Atau bisa hubungi call center kami di bagian bawah jika Pesananmu
            belum selesai dalam waktu 10 menit.
          </AlertDescription>
          <AlertAction>
            <Button
              size="icon"
              variant="default"
              onClick={() => copyOrderLink(order.id, true)}
            >
              <Copy />
            </Button>
          </AlertAction>
        </Alert>

        {/* Help center */}
        <Card className="m-1">
          <CardHeader>
            <CardTitle>Pusat Bantuan</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">
                WhatsApp Kami
              </span>
              <Button
                variant="outline"
                size="sm"
                className="bg-success text-success-foreground hover:bg-success/80 gap-2"
                onClick={() =>
                  window.open(
                    `https://wa.me/6281234567890?text=Halo,%20saya%20ingin%20menanyakan%20pesanan%20${order.id}`,
                    "_blank",
                  )
                }
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Email Kami</span>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() =>
                  (window.location.href = `mailto:support@yourdomain.com?subject=Pesanan ${order.id}`)
                }
              >
                <Mail className="h-4 w-4" />
                Email
              </Button>
            </div>{" "}
            <Separator />
            <p>
              Tim kami akan segera menghubungi Anda untuk menindaklanjuti
              pesanan. Mohon pastikan WhatsApp Anda aktif agar tidak terlewat
              informasi terkait pesanan Anda. Terimakasih telah memesan produk
              kami.
            </p>
          </CardContent>
        </Card>
      </div>
    </LandingPageLayout>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  value,
  children,
  full,
}: {
  label: string;
  value?: string;
  children?: React.ReactNode;
  full?: boolean;
}) {
  return (
    <div className={full ? "md:col-span-2" : ""}>
      <p className="text-muted-foreground text-xs">{label}</p>
      <div className="text-sm font-medium">{children ?? value}</div>
    </div>
  );
}

function Row({
  label,
  value,
  strong,
}: {
  label: string;
  value: string;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className={strong ? "text-lg font-semibold" : "text-sm"}>
        {value}
      </span>
    </div>
  );
}

function OrderDetailSkeleton() {
  return (
    <LandingPageLayout>
      <HeadMetaData title="Detail Pesananmu" />

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <Skeleton className="h-7 w-48" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-24 rounded-full" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-9 w-9 rounded-md" />
          </div>
        </div>

        {/* Order Meta */}
        <Card className="m-1">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Items */}
        <Card className="m-1">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="grid grid-cols-5 items-center gap-4">
                <Skeleton className="col-span-2 h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
                <Skeleton className="h-4" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="m-1">
          <CardHeader>
            <Skeleton className="h-6 w-44" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-6 w-1/2" />
          </CardContent>
        </Card>

        {/* Alert */}
        <Skeleton className="m-1 h-24 w-full rounded-lg" />

        {/* Help Center */}
        <Card className="m-1">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      </div>
    </LandingPageLayout>
  );
}
