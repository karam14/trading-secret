"use client";

import { useEffect, useState } from "react";
import { FcEngineering, FcFilmReel, FcMultipleDevices, FcMusic, FcOldTimeCamera, FcSalesPerformance, FcSportsMode } from "react-icons/fc";
import { IconType } from "react-icons";
import { CategoryItem } from "./category-item";
import { createClient } from "@/utils/supabase/client"; // Adjust the path to your Supabase client utility
import { Category } from "@/types/types";


const iconMap: Record<string, IconType> = {
  "Music": FcMusic,
  "Photography": FcOldTimeCamera,
  "Fitness": FcSportsMode,
  "Accounting": FcSalesPerformance,
  "Computer Science": FcMultipleDevices,
  "Filming": FcFilmReel,
  "Engineering": FcEngineering,
};

export const Categories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories') // Assuming your table is named 'categories'
        .select('id, name');

      if (error) {
        console.error("Error fetching categories:", error.message);
        return;
      }

      setCategories(data);
    };

    fetchCategories();
  }, [supabase]);

  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {categories.map((category) => (
        <CategoryItem
          key={category.id}
          label={category.name}
          icon={iconMap[category.name] || FcEngineering} // Fallback to a default icon if no match is found
          value={category.id}
        />
      ))}
    </div>
  );
};
