import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { mutate } from "swr";
import { toast } from "@/components/ui/use-toast";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const yupObject: any = {
  folder_name: yup.string().required('This field is required.'),
  folder_description: yup.string().required('This field is required.'),
};

function EditFolderModal(props: EditFolderModalProps) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, dir, onSuccess } = props;
  const router = useRouter();
  const parentID = router.query?.parent_id;
  const userID = router.query?.user_id;
  const yupSchema = yup.object(yupObject);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      folder_name: dir.name,
      folder_description: dir.folder_description
    }
  });

  let paramsObj: any = { parent_id: String(parentID), user_id: userID };
  let searchParams = new URLSearchParams(paramsObj);

  async function onSave(data: any) {

    const res = await fetch(`${baseUrl}/api/document/company/update_folder/${dir.id}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: authHeaders(session.user.access_token)
    });

    const json = await res.json();
    if (json && json.success) {
      toast({
        title: "Folder successfully created.",
        variant: "success",
        duration: 4000,
      });
      setTimeout(() => {
        onOpenChange && onOpenChange(false);
        onSuccess && onSuccess(true)
      }, 300);
    } else {
      toast({
        title: json.message,
        variant: "destructive",
        duration: 4000,
      });
    }
    if (onOpenChange) {
      onOpenChange(false);
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => onOpenChange && onOpenChange(open)}
      >
        <DialogContent
          forceMount
          className="max-w-[500px] p-0 overflow-auto gap-0"
        >
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-start sticky top-0 bg-background z-10">
            <DialogTitle>
              <div className="flex flex-col gap-1">
                <span>Edit Folder</span>
              </div>
            </DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>

          <form action="" onSubmit={handleSubmit(onSave)}>
            <div className="flex flex-col gap-3 p-4">
              <div className="flex flex-col gap-2">
                <label>Folder Name</label>
                <div>
                  <Input
                    placeholder="Folder Name"
                    className="bg-stone-100 border-0"
                    error={errors && (errors.folder_name ? true : false)}
                    {...register("folder_name")}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>Description</label>
                <div>
                  <Textarea
                    placeholder="Description"
                    className="bg-stone-100 border-0"
                    error={errors && (errors.folder_description ? true : false)}
                    {...register("folder_description")}
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="p-3">
              <Button variant={"ghost"} type="button"
                onClick={() => onOpenChange && onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(EditFolderModal);

type EditFolderModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  dir?: any;
  onSuccess?: (success: boolean) => void;
};
