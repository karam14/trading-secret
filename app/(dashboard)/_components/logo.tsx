import Image from "next/image";
import { cn } from "@/lib/utils";

export const Logo = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center transition-all duration-300",
        collapsed ? "w-5 h-5" : "w-35 h-20"
      )}
    >
      <Image
        height={collapsed ? 20 : 500}
        width={collapsed ? 20 : 500}
        alt="Logo"
        src={collapsed ? "/logo-collapsed.svg" : "/logo.svg"}
        className="transition-opacity duration-300 ease-in-out"
      />
    </div>
  );
};
