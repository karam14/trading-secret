"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
// @ts-expect-error - no types
import { useRouter } from 'nextjs-toploader/app';

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  disabled?: boolean;
  collapsed: boolean;
}

export const SidebarItem = ({ icon: Icon, label, href, disabled, collapsed }: SidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const isActive =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);

  const onClick = () => {
    if (!disabled) {
      router.push(href);
    }
  };

  return (
    <Button
      onClick={onClick}
      type="button"
      variant={"ghost"}
      className={cn(
        "p-0 w-full",
        " gap-x-2 text-slate-500 dark:text-slate-400 text-sm font-[500] pr-6 transition-all hover:text-slate-600 hover:bg-slate-300/20 dark:hover:bg-slate-600/20",
        isActive && "text-sky-700 dark:text-sky-300 bg-sky-200/20 dark:bg-sky-900/20"
      )}
      disabled={disabled}
    >
      <div className="flex w-full items-center justify-start h-full">
      <div className={cn(" opacity-0 border-2 border-sky-700 dark:border-sky-300 h-full transition-all", isActive && "opacity-100")} />
      <div className="flex items-center gap-x-2 py-4">
        <Icon size={22} className={cn("text-slate-500 dark:text-slate-400", isActive && "text-sky-700 dark:text-sky-300")} />
        {!collapsed && <span>{label}</span>}
      </div>
      </div>
    </Button>
  );
}

export default SidebarItem;
