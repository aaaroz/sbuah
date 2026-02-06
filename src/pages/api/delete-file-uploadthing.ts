import type { NextApiRequest, NextApiResponse } from "next";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { fileKey } = req.body as { fileKey?: string };

    if (!fileKey) {
      return res.status(400).json({ message: "fileKey is required" });
    }

    await utapi.deleteFiles(fileKey);

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("[UPLOADTHING_DELETE_ERROR]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete file",
    });
  }
}
