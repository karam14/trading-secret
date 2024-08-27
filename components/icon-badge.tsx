import { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const backgroundVariant = cva(
    "rounded-full flex items-center justify-center",
    {
        variants: {
            variant: {
                default: "bg-sky-100 dark:bg-sky-800",
                success: "bg-emrald-100 dark:bg-emrald-800",
            },
            size: {
                default: "p-2",
                sm: "p-1",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

const iconVariants = cva(
    "",
    {
        variants: {
            variant: {
                default: "text-sky-700 dark:text-sky-300",
                success: "text-emrald-700 dark:text-emrald-300",
            },
            size: {
                default: "h-15 w-15",
                sm: "h-4 w-4",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

type BackgroundVariantsProps = VariantProps<typeof backgroundVariant>;
type IconVariantsProps = VariantProps<typeof iconVariants>;

interface IconBadgeProps extends BackgroundVariantsProps, IconVariantsProps {
    icon: LucideIcon;
}

export const IconBadge = ({
    icon: Icon,
    variant,
    size,
}: IconBadgeProps) => {
    return (
        <div className={cn(backgroundVariant({ variant, size }))}>
            <Icon className={cn(iconVariants({ variant, size }))} />
        </div>
    );
};
