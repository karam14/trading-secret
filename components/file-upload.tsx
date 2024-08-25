"use client"

import { UploadDropzone } from "@/lib/uploadthings"
import { ourFileRouter } from "@/app/api/uploadthing/core"
import toast from "react-hot-toast";

interface FileUploadProps {
    onChange: (url?: string) => void;
    endpoint: keyof typeof ourFileRouter;
};

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
    return (
        <UploadDropzone
        appearance={{
            button:
              "ut-ready:bg-green-500 ut-uploading:cursor-not-allowed rounded-r-none bg-sky-500 bg-none after:bg-sky-400",
          }}
                className="bg-slate-800 ut-button:bg-sky-100 ut-button:ut-readying:bg-red-500/50 ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300"
            endpoint={endpoint}
            onClientUploadComplete={(res) => {onChange(res?.[0].url)}}
            onUploadError={(error: Error) => {toast.error(`An error occurred. Please try again. ${error.message}`); }}
        />
    );
}