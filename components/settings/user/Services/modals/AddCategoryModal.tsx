import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Pencil, Trash, X } from "lucide-react";
import React, { useContext, useState } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "@/components/ui/use-toast";
import { AccessTokenContext } from "@/context/access-token-context";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";

const yupObject: any = {
  category_name: yup.string().required("This field is required."),
};

export const AddNewCategoryModal = (props: AddNewCategoryModalProps) => {
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();
  const { open, onOpenChange, onSuccess } = props;
  const yupSchema = yup.object(yupObject);
  const [loading, setLoading] = useState(false);
  const service_id = router.query?.service_id ? router.query?.service_id : "";
  const parent_id = router.query?.parent_id ? router.query?.parent_id : 0;

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

  const handleFormSubmit = async (data: any) => {
    try {
      data.parent_id = parent_id;
      data.user_service_id = service_id;

      setLoading(true);
      const res = await fetch(`${baseUrl}/api/users/service/add_category`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(access_token),
      });

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: json.message,
          variant: "success",
          duration: 4000,
        });
        setTimeout(() => {
          onOpenChange && onOpenChange(false);
          onSuccess && onSuccess(true);
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
    } catch {}
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] p-0 overflow-auto gap-0 ">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>
            {" "}
            <div className="flex flex-col gap-1">
              <span>Add New Category</span>
              <span className="text-sm font-normal text-stone-500">
                Create category inside this current directory
              </span>
            </div>
          </DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <div className="flex flex-col p-2">
          <form
            action=""
            method="POST"
            onSubmit={handleSubmit(handleFormSubmit)}
          >
            <div className="flex flex-col gap-3 mt-2 px-1">
              <label>Category Name</label>
              <Input
                className="bg-stone-100 border-transparent"
                placeholder="Category Name"
                error={errors && (errors.category_name ? true : false)}
                {...register("category_name")}
              />
              {errors.category_name && (
                <span className="text-red-500 text-sm">
                  <>{errors.category_name?.message}</>
                </span>
              )}
              <DialogFooter>
                <Button
                  type="submit"
                  className={cn("w-[20%] bg-stone-600", loading && "loading")}
                >
                  Save
                </Button>
              </DialogFooter>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

type AddNewCategoryModalProps = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  onSuccess?: (success: boolean) => any;
};
