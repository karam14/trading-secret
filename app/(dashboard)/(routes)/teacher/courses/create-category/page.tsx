"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormItem, FormDescription, FormMessage, FormField, FormLabel, FormControl } from "@/components/ui/form";
import Link from "next/link";
import toast from "react-hot-toast";

const formSchema = z.object({
    name: z.string().min(1, { message: "Category name is required" }),
});

const CreateCategoryPage = () => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/categories", values);
            toast.success("Category created successfully");
            router.push(`/teacher/courses/categories`);
        } catch (error) {
            toast.error(`An error occurred. Please try again. ${error.message}`);
        }
    };
    

    return (
        <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
            <div>
                <h1 className="text-2xl">Create a New Category</h1>
                <p className="text-sm text-slate-600">Enter the name of your new category. You can change this later if needed.</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor="name">Category Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g., Technical Analysis"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>Enter the name of your category</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Link href="/">
                                <Button variant="ghost">Cancel</Button>
                            </Link>
                            <Button type="submit" disabled={!isValid || isSubmitting} loading={isSubmitting}>Create</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default CreateCategoryPage;
