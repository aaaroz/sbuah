export const orderStatusMap = {
  PENDING: { label: "Menunggu", variant: "secondary" },
  ON_PROCESS: { label: "Diproses", variant: "warning" },
  COMPLETED: { label: "Selesai", variant: "success" },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" },
} as const;

export const orderStatusRank: Record<keyof typeof orderStatusMap, number> = {
  PENDING: 4,
  ON_PROCESS: 3,
  COMPLETED: 2,
  CANCELLED: 1,
};
