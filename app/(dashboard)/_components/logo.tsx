import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";

export const Logo = ({ collapsed }: { collapsed: boolean }) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center transition-all duration-300",
        collapsed ? "w-5 h-5" : "w-35 h-20"
      )}
    >
      <Link href="/">
      <Image
        height={collapsed ? 20 : 110}
        width={collapsed ? 20 : 110}
        alt="Logo"
        src={collapsed ? "/192w/192.png" : "/favicon.svg"}
        className="transition-opacity duration-300 ease-in-out mb-1"
        
      />
      </Link>
    </div>
  );
};
