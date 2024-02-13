import Link from "next/link";
import { FileText } from "lucide-react";

type ProjectButtonParams = {
  _project_id: string;
  onCreate: any;
};

export const CreateProjectButton = ({
  _project_id,
  onCreate,
}: ProjectButtonParams) => {
  if (_project_id != "0") {
    return (
      <Link
        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
        href={`/projects/${_project_id}`}
      >
        <FileText className="w-[18px] h-[18px] text-cyan-500" />
        <span className="text-sm font-medium">Open Project</span>
      </Link>
    );
  }

  return (
    <div
      onClick={onCreate}
      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
    >
      <FileText className="w-[18px] h-[18px] text-cyan-500" />
      <span className="text-sm font-medium">Create Project</span>
    </div>
  );
};
