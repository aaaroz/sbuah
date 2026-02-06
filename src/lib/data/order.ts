export const orderStatusMap = {
  PENDING: {
    label: "Menunggu",
    variant: "secondary",
    description: "Pesananmu dalam antrian.",
  },
  ON_PROCESS: {
    label: "Diproses",
    variant: "warning",
    description: "Pesananmu sedang diproses.",
  },
  COMPLETED: {
    label: "Selesai",
    variant: "success",
    description: "Pesananmu telah selesai.",
  },
  CANCELLED: {
    label: "Dibatalkan",
    variant: "destructive",
    description: "Pesananmu telah dibatalkan.",
  },
} as const;

export const orderStatusRank: Record<keyof typeof orderStatusMap, number> = {
  PENDING: 4,
  ON_PROCESS: 3,
  COMPLETED: 2,
  CANCELLED: 1,
};
