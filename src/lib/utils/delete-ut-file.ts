export async function deleteUploadThingFile(
  fileKey: string,
): Promise<{ success: boolean }> {
  const res = await fetch("/api/delete-file-uploadthing", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ fileKey }),
  });

  if (!res.ok) {
    throw new Error("Failed to delete UploadThing file");
  }

  return res.json() as Promise<{ success: boolean }>;
}
