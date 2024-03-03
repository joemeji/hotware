import { cn } from "@/lib/utils";
import { memo } from "react";

const ProjectWorkDates = (props: ProjectWorkDatesProps) => {
  const { project } = props;

  return (
    <div className="grid grid-cols-4 items-center gap-2 px-2">
      <label className="font-medium">Travelling Date (Going To)</label>
      <div
        className={cn(
          "bg-stone-100 rounded-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex justify-between items-center pe-3"
        )}
      >
        <input
          className="px-3 py-2.5 text-sm bg-transparent outline-none w-full"
          defaultValue={project && project.project_travelling_date}
        />
      </div>
      <label className="font-medium">Installation</label>
      <div
        className={cn(
          "bg-stone-100 rounded-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex justify-between items-center pe-3"
        )}
      >
        <input
          className="px-3 py-2.5 text-sm bg-transparent outline-none w-full"
          defaultValue={project && project.project_installation_date}
        />
      </div>
      <label className="font-medium">Start Date</label>
      <div
        className={cn(
          "bg-stone-100 rounded-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex justify-between items-center pe-3"
        )}
      >
        <input
          className="px-3 py-2.5 text-sm bg-transparent outline-none w-full"
          defaultValue={project && project.project_start_date}
        />
      </div>
      <label className="font-medium">End Date</label>
      <div
        className={cn(
          "bg-stone-100 rounded-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex justify-between items-center pe-3"
        )}
      >
        <input
          className="px-3 py-2.5 text-sm bg-transparent outline-none w-full"
          defaultValue={project && project.project_end_date}
        />
      </div>
      <label className="font-medium">Dismantling Date</label>
      <div
        className={cn(
          "bg-stone-100 rounded-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex justify-between items-center pe-3"
        )}
      >
        <input
          className="px-3 py-2.5 text-sm bg-transparent outline-none w-full"
          defaultValue={project && project.project_dismantling_date}
        />
      </div>
      <label className="font-medium">Travelling Date (Going Back)</label>
      <div
        className={cn(
          "bg-stone-100 rounded-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex justify-between items-center pe-3"
        )}
      >
        <input
          className="px-3 py-2.5 text-sm bg-transparent outline-none w-full"
          defaultValue={project && project.project_travelling_back_date}
        />
      </div>
    </div>
  );
};

export default memo(ProjectWorkDates);

type ProjectWorkDatesProps = {
  project?: any;
};
