import { LucideIcon } from "lucide-react";
import { IconBadge } from "@/components/icon-badge";

interface BannerCardProps {
  variant?: "default" | "success";
  label: string;
  description: string;
  icon: LucideIcon;
}

export const BannerCard = ({
  variant,
  icon: Icon,
  description,
  label,
}: BannerCardProps) => {
  return (
    <div className="border dark:shadow-md dark:shadow-black rounded-md flex items-center gap-x-2 p-3 flex-row-reverse text-right">
      <IconBadge
        variant={variant}
        icon={Icon}
      />
      <div className="flex-1">
        <p className="font-medium">
          {label}
        </p>
        <p className="text-gray-700 dark:text-gray-200 text-sm">
          {description}
        </p>
      </div>
    </div>
  );
};
