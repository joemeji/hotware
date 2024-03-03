import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React, { useContext } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { mutate } from "swr";
import { toast } from "@/components/ui/use-toast";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { AccessTokenContext } from "@/context/access-token-context";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const yupObject: any = {
  project_scope_name: yup.string().required("This field is required."),
};

export const AddNewScopeWork = (props: AddNewScopeWorkProps) => {
  const access_token = useContext(AccessTokenContext);
  const { open, onOpenChange, project, onSuccess } = props;
  const yupSchema = yup.object(yupObject);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const handleFormSubmit = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const res = await fetch(
        `${baseUrl}/api/projects/${project._project_id}/scope/add`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: authHeaders(access_token),
        }
      );
      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "Scope Successfully Added.",
          variant: "success",
          duration: 4000,
        });
        setTimeout(() => {
          onSuccess && onSuccess(true);
          onOpenChange && onOpenChange(false);
        }, 300);
      }
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch {}
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[450px] p-0 overflow-auto gap-0 ">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>Add Scope</DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form action="" method="POST" onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="p-3">
            <div className="flex flex-col gap-3">
              <label className="font-medium">Scope of Work</label>
              <Textarea
                className="bg-stone-100 border-transparent"
                error={errors && (errors.project_scope_name ? true : false)}
                {...register("project_scope_name")}
              />
              {errors.project_scope_name && (
                <span className="text-red-500 text-sm">
                  <>{errors.project_scope_name?.message}</>
                </span>
              )}
            </div>
          </div>
          <div className="w-full flex items-center justify-end p-3">
            <Button type="submit" className={cn("w-[20%] bg-stone-600")}>
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

type AddNewScopeWorkProps = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  project?: any;
  onSuccess?: (success: any) => void;
};
