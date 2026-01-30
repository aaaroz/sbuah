export const getUploadthingKey = (url?: string | null) => {
  if (!url) return null;

  const regex = /\/f\/([^/?]+)/;
  const result = regex.exec(url);

  return result?.[1] ?? null;
};
