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
import PreCalculation from "../PreCalculation";
import PostCalculation from "../PostCalculation";
import { ScrollArea } from "@/components/ui/scroll-area";

const yupObject: any = {
  project_scope_name: yup.string().required("This field is required."),
};

export const ProjectCostCalculation = (props: ProjectCostCalculationProps) => {
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
      <DialogContent className="max-w-[1400px] p-0 overflow-auto gap-0 ">
        <ScrollArea viewPortClassName="max-h-[90vh]">
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
            <DialogTitle>Project Cost Calculation</DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <div className="flex gap-[1px] justify-between bg-stone-200 px-0 py-[1px]">
            <PreCalculation _project_id={project && project._project_id} />
            <PostCalculation
              _project_id={project && project._project_id}
              onOpenChange={() => onOpenChange && onOpenChange(false)}
            />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

type ProjectCostCalculationProps = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  project?: any;
  onSuccess?: (success: any) => void;
};
