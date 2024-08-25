"use client"
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormItem
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { ComboBox } from "@/components/ui/combobox";

const formSchema = z.object({
    categoryId: z.string().min(1),
});

interface  CategoryFormProps {
    initialData: {
        categoryId: string;
    };
    courseId: string;
    options: {label: string, value: string}[];
};
export const CategoryForm = ({
    initialData,
    courseId,
    options
}: CategoryFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const toggleEdit = () => setIsEditing((current) => !current);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });
    const { isSubmitting, isValid } = form.formState;
    const router = useRouter();
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {

            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course category updated successfully");
            toggleEdit();
            router.refresh();

        } catch (error: any) {
            toast.error(`An error occurred. Please try again. ${error.message}`);
        }
    };
    const selectdOption = options.find((option) => option.value === initialData.categoryId);
    return (
        <div className="mt-6 border bg-slate-100 rounded-md  p-6">
            <div className="font-medium flex items-center justify-between">
                Course Category
                <Button variant="ghost" onClick={toggleEdit}>
                    {isEditing && (<>Cancel</>)}
                    {!isEditing && (
                        <>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit Category
                        </>
                    )}
                </Button>
            </div>
            {!isEditing && (
                <p className={cn(
                    "", !initialData.categoryId && "text-slate-500 italic"
                )}>{selectdOption?.label || "No Category"}</p>

            )}
            {isEditing && (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="description">Course Description</FormLabel>
                                    <FormControl>
                                        <ComboBox 
                                        options={...options}
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Enter the description of your course
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                            className="bg-sky-700 rounded-md px-4 py-2 text-foreground"

                        >
                            Save
                        </Button>
                    </form>
                </Form>
            )}
        </div>
    )
}