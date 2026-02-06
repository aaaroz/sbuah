export const formatRupiahShort = (value: number) => {
  if (value >= 1_000_000) {
    return `Rp${(value / 1_000_000).toFixed(
      value % 1_000_000 === 0 ? 0 : 1,
    )}Jt`;
  }

  if (value >= 1_000) {
    return `Rp${(value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 1)}K`;
  }

  return `Rp${value}`;
};
