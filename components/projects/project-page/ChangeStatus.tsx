import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { AccessTokenContext } from "@/context/access-token-context";
import { cn } from "@/lib/utils";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useContext, useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

type ChangeStatusProps = {
  project: any;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
};

const ChangeStatus = ({
  project,
  onSuccess,
  open,
  onOpenChange,
}: ChangeStatusProps) => {
  const [alertLoading, setalertLoading] = useState(false);
  const access_token = useContext(AccessTokenContext);
  const [selectedStatus, setSelectedStatus] = useState<any>(null);

  const onChangeStatus = async () => {
    const formData = new FormData();

    formData.append("project_status", selectedStatus);

    try {
      setalertLoading(true);
      const response = await fetch(
        `${baseUrl}/api/projects/${project._project_id}/update`,
        {
          headers: authHeaders(access_token, true),
          method: "POST",
          body: formData,
        }
      );
      const json = await response.json();
      if (json.success) {
        toast({
          title: `Project status successfully updated.`,
          variant: "success",
          duration: 2000,
        });
        onSuccess && onSuccess();
        setalertLoading(false);
        onOpenChange && onOpenChange(false);
      }
    } catch (err) {
      console.log(err);
      setalertLoading(false);
      onOpenChange && onOpenChange(false);
    }
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(open: any) => {
        if (!open) setSelectedStatus(null);
      }}
    >
      <AlertDialogContent className="max-w-[360px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            Change Status for {project?.project_number}
          </AlertDialogTitle>
        </AlertDialogHeader>

        <RadioGroup onValueChange={(value: any) => setSelectedStatus(value)}>
          {project?.project_status == "closed" && (
            <label
              htmlFor="active"
              className={cn(
                "flex items-center space-x-2 rounded-xl py-3 px-3 cursor-pointer border",
                "hover:bg-green-100/50",
                selectedStatus === "closed" && "bg-green-100/50"
              )}
            >
              <RadioGroupItem value="active" id="active" />
              <span className="font-medium text-green-700">ACTIVE</span>
            </label>
          )}

          {project?.project_status == "active" && (
            <label
              htmlFor="closed"
              className={cn(
                "flex items-center space-x-2 rounded-xl py-3 px-3 cursor-pointer border",
                "hover:bg-red-100/50",
                selectedStatus === "closed" && "bg-red-100/50"
              )}
            >
              <RadioGroupItem value="closed" id="closed" />
              <span className="font-medium text-red-700">CLOSE</span>
            </label>
          )}
        </RadioGroup>

        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onChangeStatus}
            className={cn(alertLoading && "loading")}
            disabled={!selectedStatus || alertLoading}
          >
            Okay
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ChangeStatus;
