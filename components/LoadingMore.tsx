import { cn } from "@/lib/utils";
import Image from "next/image";

export default function LoadingMore({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 pt-4 justify-center", className)}>
      <Image width={20} height={20} alt="Loading" src="/images/icons8-loading.gif" />
      <span>Loading...</span>
    </div>
  );
}