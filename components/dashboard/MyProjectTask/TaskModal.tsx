import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import useAccessToken from "@/hooks/useAccessToken";
import { cn } from "@/lib/utils";
import { fetchApi } from "@/utils/api.config";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import dayjs from "dayjs";
import { ArrowRight, CalendarCheck, CalendarPlus, Tag } from "lucide-react";
import Image from "next/image";
import useSWR from "swr";
import MarkTaskDone from "./MarkTaskDone";
import { useState } from "react";
import Link from "next/link";

type TaskModalType = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  _project_id?: any;
  onSuccess?: () => void;
};

const TaskModal = ({
  open,
  onOpenChange,
  _project_id,
  onSuccess,
}: TaskModalType) => {
  const access_token = useAccessToken();
  const [openDoneModal, setOpenDoneModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);

  const { data, isLoading, error, mutate } = useSWR(
    [`/api/projects/${_project_id}/task/mytasks`, access_token],
    fetchApi
  );

  const onClickDoneTask = (task?: any) => {
    setOpenDoneModal(true);
    setSelectedTask(task);
  };

  return (
    <>
      <MarkTaskDone
        open={openDoneModal}
        onOpenChange={(open: any) => {
          setOpenDoneModal(open);
          if (!open) setSelectedTask(null);
        }}
        _project_id={_project_id}
        task={selectedTask}
        onSuccess={() => {
          mutate(data);
          onSuccess && onSuccess();
        }}
      />

      <Dialog
        open={open}
        onOpenChange={(open) => {
          onOpenChange && onOpenChange(open);
        }}
      >
        <DialogContent className="max-w-[600px] p-0 overflow-auto gap-0 ">
          <ScrollArea viewPortClassName="max-h-[99vh] min-h-[200px]">
            <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-background/60 backdrop-blur-sm z-10">
              <DialogTitle>Your Tasks</DialogTitle>
              <Link href={`/projects/${_project_id}/tasks`} target="_blank">
                <Button
                  className="rounded-xl flex items-center gap-2 py-1.5"
                  variant={"secondary"}
                >
                  <span>View Project</span>
                  <ArrowRight className="w-[18px] h-[18px] text-blue-600" />
                </Button>
              </Link>
            </DialogHeader>

            <div className="px-4 pb-6 flex flex-col gap-2">
              {isLoading && (
                <>
                  <Skeleton className="w-[300px] h-[15px]" />
                  <Skeleton className="w-[150px] h-[15px]" />
                </>
              )}
              {Array.isArray(data) &&
                data.map((item: any, key: number) => (
                  <Task
                    task={item}
                    key={key}
                    onClickDoneTask={() => onClickDoneTask(item)}
                  />
                ))}

              {Array.isArray(data) && data.length === 0 && <NoDataFound />}
            </div>

            <DialogFooter className="p-3 sticky bottom-0 backdrop-blur-sm bg-background/60">
              <Button
                variant={"secondary"}
                type="button"
                onClick={() => onOpenChange && onOpenChange(false)}
                className="rounded-xl"
              >
                Close
              </Button>
            </DialogFooter>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskModal;

function NoDataFound() {
  return (
    <div className="flex justify-center">
      <Image
        src="/images/No data-rafiki.svg"
        width={300}
        height={300}
        alt="No Data to Shown"
      />
    </div>
  );
}

function Task({
  task,
  onClickDoneTask,
}: {
  task?: any;
  onClickDoneTask?: () => void;
}) {
  return (
    <div className="p-3 border rounded-xl relative hover:bg-stone-100">
      <Status status={task.task_status} />
      <p className="font-medium text-base mb-3">{task.task_name}</p>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <p className="flex items-center gap-1">
            <CalendarPlus className="w-[18px] h-[18px]" strokeWidth={1} />
            <span className="text-[13px]">Due Date:</span>
          </p>
          <p className="font-medium">
            {task.due_date ? dayjs(task.due_date).format("MMMM DD, YYYY") : "-"}
          </p>
        </div>
        {task.task_finished_date && (
          <div className="flex items-center gap-2">
            <p className="flex items-center gap-1">
              <CalendarCheck className="w-[18px] h-[18px]" strokeWidth={1} />
              <span className="text-[13px]">Finished Date:</span>
            </p>
            <p className="font-medium">
              {task.task_finished_date
                ? dayjs(task.task_finished_date).format("MMMM DD, YYYY")
                : "-"}
            </p>
          </div>
        )}
        {task.task_priority_level && (
          <Priority priority={task.task_priority_level} />
        )}
      </div>
      <p
        className="mt-4"
        dangerouslySetInnerHTML={{ __html: task?.task_description || "" }}
      />
      {task.task_status !== "done" && (
        <Button
          className="mt-4 rounded-xl py-1.5 font-normal"
          onClick={onClickDoneTask}
        >
          Mark as Done
        </Button>
      )}
    </div>
  );
}

const priorityColor: any = {
  Low: "#fef08a",
  Medium: "#bfdbfe",
  High: "#fecaca",
  Urgent: "#ffedd5",
};

function Priority({ priority }: { priority?: any }) {
  return (
    <div className="flex items-center gap-2">
      <p className="flex items-center gap-1">
        <Tag className="w-[18px] h-[18px]" strokeWidth={1} />
      </p>
      <p
        className={cn("font-medium px-1")}
        style={{ background: priorityColor[priority] }}
      >
        {priority}
      </p>
    </div>
  );
}

const _status: any = {
  active: "#f97316",
  done: "#22c55e",
};

function Status({ status }: { status: any }) {
  return (
    <div
      className="absolute top-2 right-2 bg-red-500 text-white font-medium rounded-full text-[12px] p-[2px] px-2"
      style={{ background: _status[status] }}
    >
      {status === "active" && "Pending"}
      {status === "done" && "Done"}
    </div>
  );
}
