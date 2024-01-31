import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

export default function SearchBar() {

  return (
    <form 
      className={cn(
        'flex w-full rounded-xl ring-offset-background placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        'focus-within:outline-none focus-within:bg-stone-200 bg-stone-100 hover:bg-stone-200',
        'items-center cursor-pointer group border border-stone-100 font-medium',
        'pe-1'
      )}
    >
      <input className="px-4 py-2.5 focus:outline-none rounded-full h-full w-full text-md bg-transparent" 
        placeholder="Search" 
      />
      <button type="submit" className="flex rounded-xl p-2 items-center text-stone-600">
        <Search width={15} height={15} strokeWidth={3} />
      </button>
    </form>
  );
}