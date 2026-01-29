import { uploadthingFileRouter } from "@/server/uploadthing";
import { createRouteHandler } from "uploadthing/next-legacy";

export default createRouteHandler({
  router: uploadthingFileRouter,
});
