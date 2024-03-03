import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useState, useContext } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import { Search } from "lucide-react";
import BlockedEmployeeSelect from "@/components/app/blocked-employee-select";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { ProjectDetailsContext } from "@/pages/projects/[project_id]";
import { AccessTokenContext } from "@/context/access-token-context";
import SearchInput from "@/components/app/search-input";

dayjs.extend(timezone);

function AssignTaskModal(props: AssignTaskModal) {
  const { open, onOpenChange, task, onUpdated } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const projectDetails = useContext(ProjectDetailsContext);
  const access_token = useContext(AccessTokenContext);
  const [search, setSearch] = useState("");

  const onSubmitEditForm = async () => {
    const formData = new FormData();

    formData.append("technician_id", selectedUser.user_id);

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${baseUrl}/api/projects/${projectDetails?.data?._project_id}/task/update/${task?.parent_task_id}`,
        {
          headers: authHeaders(access_token, true),
          method: "POST",
          body: formData,
        }
      );
      const json = await response.json();
      if (json.success) {
        setIsSubmitting(false);
        onOpenChange && onOpenChange(false);
        onUpdated && onUpdated();
      }
    } catch (err: any) {
      console.log(err);
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        !isSubmitting && onOpenChange && onOpenChange(open);
        if (!open) setSelectedUser(null);
      }}
    >
      <DialogContent
        forceMount
        className="p-0 overflow-auto gap-0 max-w-[500px]"
      >
        <DialogHeader className="py-2 px-3 sticky top-0 bottom-0 backdrop-blur-sm bg-background/70 z-10">
          <div className=" flex justify-between flex-row items-center">
            <DialogTitle>Assign Task</DialogTitle>
            <DialogPrimitive.Close
              disabled={isSubmitting}
              className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200"
            >
              <X />
            </DialogPrimitive.Close>
          </div>
          <div className="w-full">
            <SearchInput
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              delay={500}
              width={null}
            />
          </div>
        </DialogHeader>

        <BlockedEmployeeSelect
          height={500}
          onSelect={(user) => setSelectedUser(user)}
          selected={selectedUser}
          search={search}
        />

        <DialogFooter className="p-3 sticky bottom-0 backdrop-blur-sm bg-background/70">
          <Button
            type="button"
            variant={"outline"}
            disabled={isSubmitting || !selectedUser}
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            disabled={isSubmitting || !selectedUser}
            className={cn(isSubmitting && "loading")}
            onClick={onSubmitEditForm}
          >
            Assign Task
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AssignTaskModal);

type AssignTaskModal = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onUpdated?: () => void;
  task?: any;
};
