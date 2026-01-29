import { type UploadthingFileRouter } from "@/server/uploadthing";
import { generateReactHelpers } from "@uploadthing/react";

export const { useUploadThing } = generateReactHelpers<UploadthingFileRouter>();
