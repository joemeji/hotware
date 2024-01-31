import { memo } from "react";
import List from "./List";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ProjectPage = () => {
  const router = useRouter();

  return (
    <div className="w-full h-full">
      <ScrollArea
        className="flex flex-col"
        viewPortClassName="min-h-[400px] rounded-app bg-white"
      >
        <div className="flex justify-between p-4 items-center">
          <p className="text-xl flex font-medium">Manage Projects</p>
          <div className="flex items-center gap-2">
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

            <Button className="px-3 rounded-xl py-1.5" variant={"secondary"}>
              <Filter className="w-[18px]" />
            </Button>

            <Button
              className="px-3 rounded-xl flex items-center gap-2 pe-4 py-1.5"
              onClick={() => {
                router.push("/projects/create");
              }}
            >
              <Plus className="w-[18px]" /> Add Project
            </Button>
          </div>
        </div>
        <List />
      </ScrollArea>
    </div>
  );
};

export default memo(ProjectPage);
