import { memo, useState } from "react";
import List from "./List";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter as useNavRouter } from "next/navigation";
import SearchInput from "@/components/app/search-input";
import { useRouter } from "next/router";

const ProjectPage = () => {
  const navRouter = useNavRouter();
  const router = useRouter();
  const [search, setSearch] = useState(router.query.search || "");

  const onSearch = (value: any) => {
    router.push({
      pathname: router.pathname,
      query: {
        search: value,
      },
    });
    setSearch(value);
  };

  return (
    <div className="w-full h-full">
      <ScrollArea
        className="flex flex-col shadow rounded-xl"
        viewPortClassName="bg-white"
      >
        <div className="flex justify-between p-4 items-center">
          <p className="text-xl flex font-medium">Manage Projects</p>
          <div className="flex items-center gap-2">
            <SearchInput
              onChange={(e) => onSearch(e.target.value)}
              value={search}
              delay={1000}
            />

            <Button className="px-3 rounded-xl py-1.5" variant={"secondary"}>
              <Filter className="w-[18px]" />
            </Button>

            <Button
              className="px-3 rounded-xl flex items-center gap-2 pe-4 py-1.5"
              onClick={() => {
                navRouter.push("/projects/create");
              }}
            >
              <Plus className="w-[18px]" /> Add Project
            </Button>
          </div>
        </div>
        <List search={search} />
      </ScrollArea>
    </div>
  );
};

export default memo(ProjectPage);
