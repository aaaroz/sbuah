import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { UploadThingError } from "uploadthing/server";
import { auth } from "./auth";
import { toFetchHeaders } from "@/lib/utils";

const f = createUploadthing();

export const uploadthingFileRouter = {
  productImage: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async ({ req, res: _res }) => {
      const session = await auth.api.getSession({
        headers: toFetchHeaders(req.headers),
      });

      // eslint-disable-next-line @typescript-eslint/only-throw-error
      if (!session?.user) throw new UploadThingError("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl };
    }),
} satisfies FileRouter;

export type UploadthingFileRouter = typeof uploadthingFileRouter;
