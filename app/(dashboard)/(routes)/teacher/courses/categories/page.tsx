"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pencil, Save, Trash, X } from "lucide-react";
import toast from "react-hot-toast";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { Category } from "@/types/types";

const supabase = createClient();

const CategoriesPage = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [newCategory, setNewCategory] = useState<string>("");
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await supabase.from('categories').select('*');
            if (error) {
                toast.error("Failed to load categories");
            } else {
                setCategories(data);
            }
        };

        fetchCategories();
    }, []);

    const handleAddCategory = async () => {
        if (newCategory.trim() === "") {
            toast.error("Category name cannot be empty");
            return;
        }

        try {
            const { data, error } = await supabase
                .from('categories')
                .insert([{ name: newCategory }])
                .select('*')
                .single();

            if (data && data.name) {
                setCategories(prev => [...prev, data]);
            } else {
                const { data: fetchedData } = await supabase
                    .from('categories')
                    .select('*')
                    .eq('id', data.id)
                    .single();
                setCategories(prev => [...prev, fetchedData]);
            }

            setNewCategory("");
            toast.success("Category added successfully");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message); // Now TypeScript knows error has a 'message' property
            } else {
                toast.error("An unknown error occurred");
            }
        }
    };

    const handleEditCategory = (id: string) => {
        const categoryToEdit = categories.find((category) => category.id === id);
        if (categoryToEdit) {
            setEditingCategory({ ...categoryToEdit });
        }
    };

    const handleSaveCategory = async () => {
        if (!editingCategory || !editingCategory.name.trim()) {
            toast.error("Category name cannot be empty");
            return;
        }

        try {
            const { error } = await supabase
                .from('categories')
                .update({ name: editingCategory.name })
                .eq('id', editingCategory.id);

            if (error) {
                throw new Error("Failed to update category");
            }

            setCategories(categories.map(category =>
                category.id === editingCategory.id ? editingCategory : category
            ));
            setEditingCategory(null);
            toast.success("Category updated successfully");
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message); // Now TypeScript knows error has a 'message' property
            } else {
                toast.error("An unknown error occurred");
            }
        }
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);  // Reset the editing state
    };

    const handleOpenDialog = (category: Category) => {
        setCategoryToDelete(category);
        setIsDialogOpen(true); // Open the dialog
    };
    

    const handleCloseDialog = () => {
        setIsDialogOpen(false); // Close the dialog
        setCategoryToDelete(null); // Clear the category to delete
    };

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return;

        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', categoryToDelete.id);

            if (error) {
                throw new Error("Failed to delete category");
            }

            setCategories(categories.filter(category => category.id !== categoryToDelete.id));
            toast.success("Category deleted successfully");
            handleCloseDialog(); // Close the dialog after deletion
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error(error.message); // Now TypeScript knows error has a 'message' property
            } else {
                toast.error("An unknown error occurred");
            }
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-y-2">
                    <h1 className="text-2xl font-medium">Manage Categories</h1>
                    <span className="text-sm text-slate-700">
                        {categories.length} categories available
                    </span>
                </div>
            </div>
            <div className="flex items-center gap-2 mb-6">
                <Input
                    placeholder="New Category Name"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="max-w-md"
                />
                <Button onClick={handleAddCategory} className="ml-2">Add Category</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => (
                    category && (
                        <Card key={category.id} className="p-4 shadow-lg rounded-lg border border-gray-200">
                            <CardHeader>
                                <CardTitle>
                                    {editingCategory && editingCategory.id === category.id ? (
                                        <Input
                                            value={editingCategory.name || ""}
                                            onChange={(e) =>
                                                setEditingCategory({
                                                    ...editingCategory,
                                                    name: e.target.value,
                                                })
                                            }
                                            className="font-normal"
                                        />
                                    ) : (
                                        <span className="font-medium">{category.name || "Unnamed Category"}</span>
                                    )}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex justify-end gap-2">
                                {editingCategory && editingCategory.id === category.id ? (
                                    <>
                                        <Button onClick={handleCancelEdit} variant="ghost" className="flex items-center">
                                            <X className="h-4 w-4 mr-1" /> Cancel
                                        </Button>
                                        <Button onClick={handleSaveCategory} className="flex items-center">
                                            <Save className="h-4 w-4 mr-1" /> Save
                                        </Button>

                                    </>
                                ) : (
                                    <>
                                        <Button onClick={() => handleEditCategory(category.id)} className="flex items-center">
                                            <Pencil className="h-4 w-4 mr-1" /> Edit
                                        </Button>
                                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                            <DialogTrigger asChild>
                                                <Button onClick={() => handleOpenDialog(category)} variant="ghost" className="flex items-center">
                                                    <Trash className="h-4 w-4 mr-1" /> Delete
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Confirm Deletion</DialogTitle>
                                                </DialogHeader>
                                                <p>Are you sure you want to delete this category? This action cannot be undone.</p>
                                                <DialogFooter>
                                                    <Button variant="ghost" onClick={handleCloseDialog}>Cancel</Button>
                                                    <Button variant="destructive" onClick={handleDeleteCategory}>Delete</Button>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )
                ))}
            </div>
        </div>
    );
};

export default CategoriesPage;
