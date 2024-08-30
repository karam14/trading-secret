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
// @ts-expect-error - no types
import { useRouter } from 'nextjs-toploader/app';import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
    description: z.string().min(1, { message: "Description is required" })
});

interface DescriptionFormProps {
    initialData: {
        description: string;
    };
    courseId: string;
};
export const DescriptionForm = ({
    initialData,
    courseId
}: DescriptionFormProps) => {
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
            toast.success("Course description updated successfully");
            toggleEdit();
            router.refresh();

        } catch (error: any) {
            toast.error(`An error occurred. Please try again. ${error.message}`);
        }
    };
    return (
        <div className="mt-6 border bg-slate-100 dark:bg-slate-700 rounded-md p-6">
          <div className="font-medium flex items-center justify-between text-gray-900 dark:text-gray-100">
            Course Description
            <Button variant="ghost" onClick={toggleEdit}>
              {isEditing && (<>Cancel</>)}
              {!isEditing && (
                <>
                  <Pencil className="h-4 w-4 mr-2" />
                  Edit Description
                </>
              )}
            </Button>
          </div>
          {!isEditing && (
            <p className={cn(
              "text-gray-900 dark:text-gray-100",
              !initialData.description && "text-slate-500 dark:text-slate-400 italic"
            )}>
              {initialData.description || "No Description"}
            </p>
          )}
          {isEditing && (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel htmlFor="description" className="text-gray-900 dark:text-gray-100">Course Description</FormLabel>
                      <FormControl>
                        <Textarea
                          disabled={isSubmitting}
                          placeholder="This is a course about..."
                          {...field}
                          className="bg-white dark:bg-slate-600 text-gray-900 dark:text-gray-100"
                        />
                      </FormControl>
                      <FormDescription className="text-gray-500 dark:text-gray-400">
                        Enter the description of your course
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={!isValid || isSubmitting}
                  className="bg-sky-700 dark:bg-sky-600 rounded-md px-4 py-2 text-foreground"
                >
                  Save
                </Button>
              </form>
            </Form>
          )}
        </div>
      );
      
}