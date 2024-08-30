"use client"
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {  File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
// @ts-expect-error - no types
import { useRouter } from 'nextjs-toploader/app';import { FileUpload } from "@/components/file-upload";
import Image from "next/image";

const formSchema = z.object({
    url: z.string().min(1),
});

interface AttachmentFormProps {
    initialData: {
        attachments: { id: string; name: string }[]; // Add type annotation for attachments array
    };
    courseId: string;
};
export const AttachmentForm = ({
    initialData,
    courseId
}: AttachmentFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            await axios.post(`/api/courses/${courseId}/attachments`, values);
            toast.success("Course Attachments updated successfully");
            toggleEdit();
            router.refresh();

        } catch (error: any) {
            toast.error(`An error occurred. Please try again. ${error.message}`);
        }
    };
    const onDelete = async (id: string) => {
        try {
            setDeletingId(id);
            await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
            toast.success("Attachment deleted successfully");
            router.refresh();
        } catch (error: any) {
            toast.error(`An error occurred. Please try again. ${error.message}`);
        } finally {
            setDeletingId(null);
        }
    }
    return (
<div className="mt-6 border bg-slate-100 dark:bg-slate-700 rounded-md p-6">
  <div className="font-medium flex items-center justify-between text-gray-900 dark:text-gray-100">
    Course Attachments
    <Button variant="ghost" onClick={toggleEdit}>
      {isEditing && (<>Cancel</>)}
      {!isEditing && (
        <>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add a file
        </>
      )}
    </Button>
  </div>
  {!isEditing && (
    <>
      {initialData.attachments.length === 0 && (
        <p className="text-sm mt-2 text-slate-500 dark:text-slate-400 italic">No attachments yet</p>
      )}
      {initialData.attachments.length > 0 && (
        <div className="space-y-2">
          {initialData.attachments.map((attachment) => (
            <div key={attachment.id} className="flex items-center p-3 w-full bg-sky-100 dark:bg-sky-800 border-sky-200 dark:border-sky-700 border text-sky-700 dark:text-sky-300 rounded-md">
              <File className="h-4 w-4 mr-2 flex-shrink-0" />
              <p className="text-xs line-clamp-1">
                {attachment.name}
              </p>
              {deletingId !== attachment.id && (
                <button onClick={() => onDelete(attachment.id)} className="ml-auto hover:opacity-75 transition">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  )}
  {isEditing && (
    <div>
      <FileUpload
        endpoint="courseAttachment"
        onChange={(url) => { if (url) onSubmit({ url: url }); }}
      />
      <div className="text-xs text-muted-foreground dark:text-slate-300 mt-4">
        Add anything your students might need to complete the course
      </div>
    </div>
  )}
</div>

    )
}