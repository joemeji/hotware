import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { AccessTokenContext } from "@/context/access-token-context";
import { cn } from "@/lib/utils";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useContext, useState } from "react";

type AddFromShipping = {
  _project_id: any;
  onSuccess?: () => void;
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
};

const AddFromShipping = ({
  _project_id,
  onSuccess,
  open,
  onOpenChange,
}: AddFromShipping) => {
  const [alertLoading, setalertLoading] = useState(false);
  const access_token = useContext(AccessTokenContext);

  const onAddFromShipping = async () => {
    try {
      setalertLoading(true);
      const response = await fetch(
        `${baseUrl}/api/projects/${_project_id}/equipment/add_from_shipping`,
        {
          headers: authHeaders(access_token, true),
          method: "POST",
        }
      );
      const json = await response.json();
      if (json.success) {
        toast({
          title: `Created successfully.`,
          variant: "success",
          duration: 2000,
        });
        onSuccess && onSuccess();
        setalertLoading(false);
        onOpenChange && onOpenChange(false);
      } else {
        toast({
          title: `No item to add from shipping.`,
          variant: "error",
          duration: 2000,
        });
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
    <AlertDialog open={open}>
      <AlertDialogContent className="max-w-[360px]">
        <AlertDialogHeader>
          <AlertDialogTitle>{"Are you sure?"}</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to add item from Shipping List?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => onOpenChange && onOpenChange(false)}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onAddFromShipping}
            className={cn(alertLoading && "loading")}
          >
            Okay
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AddFromShipping;
