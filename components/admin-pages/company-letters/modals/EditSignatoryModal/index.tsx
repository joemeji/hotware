import { memo, useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignatoryNameSelect } from "@/components/admin-pages/company-letters/form-elements/SignatoryNameSelect";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import GenericModal from "../GenericModal";
import { fetcher } from "@/utils/api.config";

const yupObject: any = {
  user_id: yup.string().required("This field is required."),
  signatory_id: yup.string(),
};

function UpdateSignatoryModal(props: IEditSignatoryModal) {
  const { open, onOpenChange, loadingId, signatoryId } = props;
  const [data, setData] = useState<any>();

  const yupSchema = yup.object(yupObject);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
    control,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  useEffect(() => {
    async function getSignatoryDetails() {
      setData(null);
      const signatory = await fetch(
        `/api/signatory/details?signatoryId=${signatoryId}`
      );
      const data = await signatory.json();
      setData(data);
    }

    if (open) {
      getSignatoryDetails();
    }
  }, [open, signatoryId]);

  const updateSignatory = async (data: any) => {
    try {
      const payload = {
        ...data,
      };

      const res = await fetch("/api/signatory/update", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/signatory/lists`);
        toast({
          title: "Successfully Added",
          variant: "success",
          duration: 4000,
        });

        setTimeout(() => {
          onOpenChange && onOpenChange(false);
        }, 300);

        if (onOpenChange) {
          onOpenChange(false);
        }
      } else {
        toast({
          title: json?.error,
          variant: "error",
          duration: 4000,
        });
      }
    } catch {}
  };

  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title="Update Signatory"
    >
      <form action="" method="post" onSubmit={handleSubmit(updateSignatory)}>
        <div className="p-3">
          <div className="flex flex-col gap-3">
            <label className="font-medium">
              Name <span className="text-red-500 text-sm">*</span>
            </label>
            <Controller
              name="user_id"
              control={control}
              render={({ field }) => (
                <SignatoryNameSelect
                  onChangeValue={(value: any) => field.onChange(value)}
                  value={field.value}
                />
              )}
            />
            {errors.user_id && (
              <span className="text-red-500 text-sm">
                <>{errors.user_id?.message}</>
              </span>
            )}
            <input
              type="hidden"
              {...register("signatory_id")}
              defaultValue={signatoryId}
            />
          </div>
        </div>
        <div className="w-full flex items-center justify-end p-3">
          <Button type="submit" className="w-[10%] bg-stone-600">
            Submit
          </Button>
        </div>
      </form>
    </GenericModal>
  );
}

export default UpdateSignatoryModal;

type IEditSignatoryModal = {
  open?: boolean;
  signatoryId: string;
  onOpenChange?: (open: boolean) => void;
  loadingId?: any;
};
