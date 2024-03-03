import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import useAccessToken from "@/hooks/useAccessToken";
import { cn } from "@/lib/utils";
import { authHeaders, baseUrl } from "@/utils/api.config";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useState } from "react";

type MarkTaskDoneType = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  _project_id?: any;
  task?: any;
  onSuccess?: () => void;
};

const MarkTaskDone = ({
  open,
  onOpenChange,
  _project_id,
  task,
  onSuccess,
}: MarkTaskDoneType) => {
  const [dateFinished, setDateFinished] = useState<any>(null);
  const [remarks, setRemarks] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const access_token = useAccessToken();

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append("task_finished_date", dateFinished);
      formData.append("task_remarks", remarks);

      const res = await fetch(
        `${baseUrl}/api/projects/${_project_id}/task/marks_done/${task.task_id}`,
        {
          method: "post",
          headers: authHeaders(access_token, true),
          body: formData,
        }
      );
      const json = await res.json();
      if (json.success) {
        setLoading(false);
        toast({
          variant: "success",
          description: "Task successfully marked as done.",
          duration: 2000,
        });
        onSuccess && onSuccess();
        onOpenChange && onOpenChange(false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange && onOpenChange(open);
        if (!open) {
          setDateFinished(null);
          setRemarks(null);
        }
      }}
    >
      <DialogContent className="max-w-[500px] p-0 overflow-auto gap-0 ">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>Mark Task As Done</DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          <div className="px-4 py-2 flex flex-col gap-3">
            <div className="flex flex-col gap-2">
              <label>Date Finished</label>
              <Input
                type="date"
                className="border-0 bg-stone-100"
                value={dateFinished || ""}
                onChange={(e) => setDateFinished(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <label>Remarks</label>
              <Textarea
                className="border-0 bg-stone-100"
                value={remarks || ""}
                onChange={(e) => setRemarks(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter className="p-3">
            <Button
              type="submit"
              disabled={!dateFinished || !remarks || loading}
              className={cn(loading && "loading")}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MarkTaskDone;
