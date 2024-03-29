import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "@/components/ui/use-toast";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";

const yupObject: any = {
  folder_name: yup.string().required("This field is required."),
  folder_description: yup.string().required("This field is required."),
};

function NewFolderModal(props: NewFolderModalProps) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, onSuccess } = props;
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const parentID = router.query?.parent_id;
  const yupSchema = yup.object(yupObject);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  async function onSave(data: any) {
    setLoading(true);
    const res = await fetch(
      `${baseUrl}/api/document/company/create_company_folder/${parentID}`,
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(session.user.access_token),
      }
    );

    const json = await res.json();
    if (json && json.success) {
      toast({
        title: "Folder successfully created.",
        variant: "success",
        duration: 4000,
      });
      setTimeout(() => {
        onOpenChange && onOpenChange(false);
        onSuccess && onSuccess();
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
    setLoading(false);
    reset();
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
                <span>Create Folder</span>
                <span className="text-sm font-normal text-stone-500">
                  Create folder inside this current directory
                </span>
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
              <Button variant={"ghost"} type="button">
                Cancel
              </Button>
              <Button className={cn(loading && "loading")} type="submit">
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(NewFolderModal);

type NewFolderModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
};
