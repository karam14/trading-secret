"use client"

import { Course } from "@/types/types"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Pencil, Trash } from "lucide-react"
import Link from "next/link";
import { useState } from "react";
import axios from "axios";
// @ts-expect-error - no types
import { useRouter } from 'nextjs-toploader/app';import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/modals/confirm-modal";

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "is_published",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Published
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const is_published = row.getValue("is_published") || false;

      return (
        <Badge className={cn(
          "bg-slate-500",
          is_published && "bg-sky-700"
        )}>
          {is_published ? "Published" : "Draft"}
        </Badge>
      )
    }
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const { id } = row.original;
      const router = useRouter();
      const [isLoading, setIsLoading] = useState(false);

      const handleDelete = async () => {
        try {
          setIsLoading(true);
          await axios.delete(`/api/courses/${id}`);
          toast.success("Course deleted");
          router.refresh(); // Refresh the page to update the data
        } catch (error) {
          toast.error("Failed to delete course");
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <div className="flex items-center space-x-2">
          <Link href={`/teacher/courses/${id}`}>
            <Button variant="outline" size="sm">
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </Link>
          <ConfirmModal actionVariant="destructive" onConfirm={handleDelete}>
            <Button variant="ghost" size="sm" disabled={isLoading}>
              <Trash className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </ConfirmModal>
        </div>
      );
    },
  },
]
