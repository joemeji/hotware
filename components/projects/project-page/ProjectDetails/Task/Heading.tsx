import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";

export default function Heading({ onClickNewTask }: Heading) {
  return (
    <div className="flex justify-between items-center bg-background p-3 rounded-t-xl">
      <p className="text-base font-medium">Tasks</p>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          onClick={onClickNewTask}
          className="px-3 rounded-xl flex items-center gap-2 pe-4 py-1.5"
        >
          <Plus className="w-[18px]" /> New Task
        </Button>
        <form>
          <div className="bg-stone-100 flex items-center w-[300px] rounded-xl overflow-hidden px-2 h-9 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-visible:ring-offset-2">
            <Search className="text-stone-400 w-5 h-5" />
            <input
              placeholder="Search"
              className="border-0 rounded-none outline-none text-sm w-full px-2 bg-stone-100 h-full max-w-[300px]"
              name="search"
            />
          </div>
        </form>
      </div>
    </div>
  );
}

type Heading = {
  onClickNewTask?: () => void;
};
