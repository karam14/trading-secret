"use client"
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {  ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FileUpload } from "@/components/file-upload";
import Image from "next/image";

const formSchema = z.object({
    imageUrl: z.string().min(1, { message: "image is required" })
});

interface ImageFormProps {
    initialData: {
        imageUrl: string;
    };
    courseId: string;
};
export const ImageForm = ({
    initialData,
    courseId
}: ImageFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);

    const router = useRouter();
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course image updated successfully");
            toggleEdit();
            router.refresh();

        } catch (error: any) {
            toast.error(`An error occurred. Please try again. ${error.message}`);
        }
    };
    return (
        <div className="mt-6 border bg-slate-100 rounded-md  p-6">
            <div className="font-medium flex items-center justify-between">
                Course Image
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && (<>Cancel</>)}
                    {!isEditing && !initialData.imageUrl &&(
                        <>
                            <PlusCircle className="h-4 w-4 mr-2" />
                            Add image
                        </>
                    )}
                    {!isEditing && initialData.imageUrl && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit image
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                !initialData.imageUrl ? (
                    <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                        <ImageIcon className="h-10 w-10 text-slate-500" />
                    </div>
        
                ): (
                    <div className="relative aspect-video mt-2">

                        <Image
                            src={initialData.imageUrl}
                            alt="Course Image"
                            fill
                            className="object-cover rounded-md" />
                        </div>
                )

            )}
            {isEditing && (
                    <div>

                        <FileUpload
                         endpoint="CourseImage"
                         onChange={(url) =>{if(url) {
                            onSubmit({imageUrl: url});
                            }}} />

                        <div className="text-xs text-muted-foreground mt-4">
                            16:9 aspect ratio recommended
                        </div>
                    </div>
            )}
        </div>
    )
}