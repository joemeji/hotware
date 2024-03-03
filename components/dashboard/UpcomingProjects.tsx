import { useState } from "react";
import ProjectList from "../projects/project-page/List";
import { ScrollArea } from "../ui/scroll-area";
import SearchInput from "../app/search-input";

export default function UpcomingProjects() {
  const [search, setSearch] = useState("");

  return (
    <div className="w-full bg-white rounded-xl shadow">
      <ScrollArea viewPortClassName="min-h-[400px] max-h-[500px]">
        <div className="flex justify-between items-center py-2 px-3">
          <p className="text-base flex font-medium">Upcoming Projects</p>
          <div className="flex items-center gap-2">
            <SearchInput
              value={search || ""}
              onChange={(e) => setSearch(e.target.value)}
              delay={1000}
            />
          </div>
        </div>
        <ProjectList dashboardView={true} search={search} />
      </ScrollArea>
    </div>
  );
}
