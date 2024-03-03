import { TD, TH } from "@/components/items";
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
import { authHeaders, baseUrl, fetcher } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import useSWR, { mutate } from "swr";
import { ProjectTechnicianStatus } from "../FormElements/ChangeStatusSelect";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/ui/button";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

const yupObject: any = {
  project_technician_status: yup.number().required("This field is required."),
};

export const ChangeStatus = (props: ChangeStatus) => {
  const { data: session }: any = useSession();
  const { open, onOpenChange, project, onSuccess } = props;
  const yupSchema = yup.object(yupObject);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control,
    getValues,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const handleCancel = () => {
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  const handleContinue = async (data: any) => {
    try {
      const res = await fetch(
        `${baseUrl}/api/projects/${project._project_id}/changeTechnicianListStatus`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: authHeaders(session.user.access_token),
        }
      );
      const json = await res.json();
      if (json.success) {
        toast({
          title: json.message,
          variant: "success",
          duration: 4000,
        });
        onSuccess && onSuccess(true);
        if (onOpenChange) {
          onOpenChange(false);
        }
      } else {
        toast({
          title: json.message,
          variant: "destructive",
          duration: 4000,
        });
      }
    } catch {}
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-[400px]">
        <form action="" method="post" onSubmit={handleSubmit(handleContinue)}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Change Status for the List of Technicians
            </AlertDialogTitle>
            <AlertDialogDescription>
              <div className="flex flex-col gap-3">
                <label>Select Status</label>
                <Controller
                  name="project_technician_status"
                  control={control}
                  render={({ field }) => (
                    <ProjectTechnicianStatus
                      onChangeValue={(value: any) => {
                        field.onChange(value);
                      }}
                      value={field.value}
                    />
                  )}
                />
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-5">
            <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
            <Button type="submit" onClick={handleContinue}>
              Save
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

type ChangeStatus = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  project?: any;
  onSuccess?: (success: boolean) => void;
};
