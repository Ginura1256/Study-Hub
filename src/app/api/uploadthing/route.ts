import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Sanitize UPLOADTHING_TOKEN by stripping any surrounding quotes
if (process.env.UPLOADTHING_TOKEN) {
  process.env.UPLOADTHING_TOKEN = process.env.UPLOADTHING_TOKEN.trim().replace(/^['"]|['"]$/g, '');
}
if (process.env.UPLOADTHING_SECRET) {
  process.env.UPLOADTHING_SECRET = process.env.UPLOADTHING_SECRET.trim().replace(/^['"]|['"]$/g, '');
}

const token = process.env.UPLOADTHING_TOKEN;
const secret = process.env.UPLOADTHING_SECRET;

if (!token && !secret) {
  console.warn("⚠️ [UploadThing Warning]: No UPLOADTHING_TOKEN or UPLOADTHING_SECRET found in .env.local!");
} else {
  console.log("✅ [UploadThing Init]: UploadThing API Token loaded successfully.");
}

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  config: {
    logLevel: "Debug",
  },
});
