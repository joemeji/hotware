import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "@/components/ui/use-toast";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { ProjectRoleSelect } from "../FormElements/ProjectRoleSelect";
import { ProjectSecondRoleSelect } from "../FormElements/ProjectSecondRoleSelect";
import { TechnicianOverlap } from "./TechnicianOverlap";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

const yupObject: any = {
  company_id: yup.number(),
  company_name: yup.string(),
  project_technician_id: yup.number(),
  project_technician_name: yup.string(),
  project_role_id: yup.number().required("This field is required."),
};

function UpdateTechnician(props: UpdateTechnicianProps) {
  const { data: session }: any = useSession();
  let isAdded;
  const { open, onOpenChange, project, onSuccess, technician } = props;
  const yupSchema = yup.object(yupObject);
  const secondRoleArrays = technician.project_second_role_id
    .split(", ")
    .map(Number);
  const [secondRole, setSecondRole] = useState<any>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control,
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      company_name: technician.company_name,
      company_id: technician.company_id,
      project_technician_id: technician.project_technician_id,
      project_technician_name: `${technician.user_firstname} ${technician.user_lastname}`,
      project_role_id: technician.project_role_id,
    },
  });

  async function onSave() {
    const payload = getValues();
    payload.project_second_role_id = secondRole;

    const res = await fetch(
      `${baseUrl}/api/projects/${project._project_id}/technician/update/${technician.project_technician_id}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: authHeaders(session.user.access_token),
      }
    );

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
    setSecondRole([]);
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => onOpenChange && onOpenChange(open)}
      >
        <DialogContent
          forceMount
          className="max-w-[550px] p-0 overflow-auto gap-0"
        >
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
            <DialogTitle>Update Project Technician</DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <div className="p-2">
            <div className="flex flex-col gap-2 py-1 rounded-app bg-white">
              <div className=" py-1 px-2"></div>
              <form action="" method="post" onSubmit={handleSubmit(onSave)}>
                <div className="flex flex-col gap-3 px-2">
                  <div className="flex flex-col gap-1">
                    <label>Company</label>
                    <Input
                      className="bg-stone-100 border-transparent"
                      error={errors && (errors.company_name ? true : false)}
                      {...register("company_name")}
                      readOnly
                    />
                    {errors.company_name && (
                      <span className="text-red-500 text-sm">
                        <>{errors.company_name?.message}</>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <label>Project Technician</label>
                    <Input
                      className="bg-stone-100 border-transparent"
                      error={
                        errors &&
                        (errors.project_technician_name ? true : false)
                      }
                      {...register("project_technician_name")}
                      readOnly
                    />
                    {errors.project_technician_name && (
                      <span className="text-red-500 text-sm">
                        <>{errors.project_technician_name?.message}</>
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-3">
                      <label>Role</label>
                      <Controller
                        name="project_role_id"
                        control={control}
                        render={({ field }) => (
                          <ProjectRoleSelect
                            onChangeValue={(value: any) => {
                              field.onChange(value);
                            }}
                            value={field.value}
                            project_id={project._project_id}
                          />
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label>Second Role</label>
                      <ProjectSecondRoleSelect
                        onChangeValue={(value: any) => {
                          setSecondRole(value);
                        }}
                        value={secondRole}
                        project_id={project._project_id}
                      />
                    </div>
                  </div>
                  <div>
                    <Button className="mt-2 w-full" type="submit">
                      Submit
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(UpdateTechnician);

type UpdateTechnicianProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  project?: any;
  onSuccess?: (success: boolean) => void;
  technician?: any;
};
