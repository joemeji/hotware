import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useState, useRef, useContext, useEffect } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RichTextEditor } from "@/components/RichTextEditor";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { Input } from "@/components/ui/input";
import { Controller, useForm } from "react-hook-form";
import { taskSchema } from "../../schema";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { ProjectDetailsContext } from "@/pages/projects/[project_id]";
import { AccessTokenContext } from "@/context/access-token-context";
import { toast } from "@/components/ui/use-toast";

dayjs.extend(timezone);

const priorityLevels = ["Low", "Medium", "High", "Urgent"];

function AddTaskModal(props: AddTaskModalProps) {
  const { open, onOpenChange, onUpdated, task } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const editorRef = useRef(null);
  const projectDetails: any = useContext(ProjectDetailsContext);
  const access_token = useContext(AccessTokenContext);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(taskSchema),
  });

  const onSubmitEditForm = async (data: any) => {
    const newValue = (editorRef?.current as any)?.getContent();

    const formData = new FormData();
    const payload = {
      ...data,
      task_description: newValue,
    };

    for (let [key, value] of Object.entries(payload)) {
      formData.append(key, value as string);
    }

    let url = `${baseUrl}/api/projects/${projectDetails?.data?._project_id}/task/create`;

    if (task) {
      url = `${baseUrl}/api/projects/${projectDetails?.data?._project_id}/task/update/${task?.parent_task_id}`;
    }

    try {
      setIsSubmitting(true);
      const response = await fetch(url, {
        headers: authHeaders(access_token, true),
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      if (json.success) {
        const toastPayload: any = {
          title: "New Task has been create successfully.",
          variant: "success",
          duration: 2000,
        };

        if (task) toastPayload["title"] = "Task has been updated successfully.";

        toast(toastPayload);

        setIsSubmitting(false);
        onOpenChange && onOpenChange(false);
        onUpdated && onUpdated();
      }
    } catch (err: any) {
      console.log(err);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!open) {
      reset();
    }
  }, [reset, open]);

  useEffect(() => {
    if (task) {
      setValue("task_name", task.task_name);
      setValue("task_priority_level", task.task_priority_level);
      setValue("due_date", task.due_date);
    }
  }, [task, setValue]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) =>
        !isSubmitting && onOpenChange && onOpenChange(open)
      }
    >
      <DialogContent
        forceMount
        className="max-w-[720px] p-0 overflow-auto gap-0"
      >
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-background z-10">
          <DialogTitle>{task ? "Update" : "Add"} Task</DialogTitle>
          <DialogPrimitive.Close
            disabled={isSubmitting}
            className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200"
          >
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmitEditForm)}>
          <div className="flex flex-col gap-3 p-4 relative min-h-[350px]">
            <div className="flex flex-col gap-2">
              <label>Task Name</label>
              <div>
                <Input
                  placeholder="Task Name"
                  className="bg-stone-100 border-0"
                  error={errors && (errors.task_name ? true : false)}
                  {...register("task_name")}
                />
                {errors.task_name && (
                  <span className="text-red-500 text-sm">
                    <>{errors.task_name?.message}</>
                  </span>
                )}
              </div>
            </div>

            <div className="flex gap-3 w-full mb-3">
              <div className="flex flex-col gap-2 w-1/2">
                <label>Priority Level</label>
                <div>
                  <Controller
                    name="task_priority_level"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
                        <SelectTrigger className="bg-stone-100 border-0 h-10 w-full rounded-app text-left">
                          <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem
                            value={""}
                            className="cursor-pointer hover:bg-stone-100"
                          >
                            No Priority
                          </SelectItem>
                          {priorityLevels.map((prio: any, key: number) => (
                            <SelectItem
                              value={prio}
                              className="cursor-pointer hover:bg-stone-100"
                              key={key}
                            >
                              {prio}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2  w-1/2">
                <label>Due Date</label>
                <div>
                  <Input
                    type="date"
                    placeholder="Due Date"
                    className="bg-stone-100 border-0"
                    error={errors && (errors.due_date ? true : false)}
                    {...register("due_date")}
                  />
                  {errors.due_date && (
                    <span className="text-red-500 text-sm">
                      <>{errors.due_date?.message}</>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-2">
              <label htmlFor="">Task Description</label>
              <RichTextEditor
                ref={editorRef}
                height={300}
                value={task?.task_description || ""}
              />
            </div>
          </div>

          <DialogFooter className="p-3">
            <Button
              variant={"outline"}
              type="button"
              disabled={isSubmitting}
              onClick={() => onOpenChange && onOpenChange(false)}
            >
              Reset
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(isSubmitting && "loading")}
            >
              {task ? "Update" : "Save"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AddTaskModal);

type AddTaskModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onUpdated?: () => void;
  task?: any;
};
