import { getAuthSession } from "@/lib/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing(); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    // Define as many FileRoutes as you like, each with a unique routeSlug
    profilePicture: f(['image'])
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const user = await getAuthSession();

            // If you throw, the user will not be able to upload
            if (!user?.user) throw new Error("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: user.user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);

            console.log("file url", file.url);

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId, url: file.url };
        }),
    mediaUploader: f({
        image: { maxFileSize: "2MB", maxFileCount: 1 },
        video: { maxFileSize: "256MB", maxFileCount: 1 },
    })
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const user = await getAuthSession();

            // If you throw, the user will not be able to upload
            if (!user?.user) throw new Error("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: user.user.id };
        })
        .onUploadComplete((data) => console.log("file", data)),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;