import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

export const ourFileRouter = {
  // Course Material Router accepting PDFs and PPTX presentation files up to 32MB
  courseMaterial: f({
    pdf: { maxFileSize: "32MB", maxFileCount: 5 },
    "application/pdf": { maxFileSize: "32MB", maxFileCount: 5 },
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": {
      maxFileSize: "32MB",
      maxFileCount: 5,
    },
    blob: { maxFileSize: "32MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      // Middleware logic (e.g. session auth check)
      return { userId: "csne-student-01" };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      console.log("File Key:", file.key);
      console.log("File Name:", file.name);

      return { uploadedBy: metadata.userId, url: file.url, name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
