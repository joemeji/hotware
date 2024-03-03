import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { baseUrl } from "@/utils/api.config";
import { LeaveFormSchema } from "../../schema";
import { Textarea } from "@/components/ui/textarea";
import { DatePicker } from "@/components/ui/datepicker";
import LeaveCategorySelect from "@/components/app/leave-category-select";
import CountrySelect from "@/components/app/country-select";
import { TechnicianSelect } from "@/components/app/technician-select";
import { Checkbox } from "@/components/ui/checkbox";
import dayjs from "dayjs";

interface LeaveFormProps {
  id?: string;
  selected?: any;
  onSuccess?: () => void;
  onOpenChange?: (open: boolean) => void;
}
export const LeaveForm = (props: LeaveFormProps) => {
  const { id, selected, onOpenChange, onSuccess } = props;

  const {
    control,
    formState: { errors },
    register,
    handleSubmit,
    setError,
  } = useForm({
    resolver: yupResolver(LeaveFormSchema),
    defaultValues: selected
      ? {
          ...selected,
          excuse_category: selected.excuse_category_id,
          user_id: [selected.user_id],
        }
      : {},
  });

  const submit = async (data: any) => {
    try {
      if (!data.user_id && !data.all_technicians) {
        setError("user_id", { message: "Field is required." });
        return;
      }

      const res = await fetch(
        `${baseUrl}/api/leaves${selected ? `/${selected.excuse_id}/edit` : ""}`,
        {
          method: selected ? "PUT" : "POST",
          body: JSON.stringify({
            leave: {
              ...data,
              excuse_from_date: dayjs(data.excuse_from_date).format(
                "YYYY-MM-DD"
              ),
              excuse_to_date: dayjs(data.excuse_to_date).format("YYYY-MM-DD"),
            },
          }),
        }
      );

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: `${id ? "Successfully updated!" : "Successfully added!"}`,
          variant: "success",
          duration: 4000,
        });
        onSuccess?.();

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
    <form onSubmit={handleSubmit(submit)} className="mt-7 flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <label className="font-medium">Category</label>
        <Controller
          name="excuse_category"
          control={control}
          render={({ field }) => (
            <LeaveCategorySelect
              onChangeValue={(value) => field.onChange(value)}
              value={field.value}
              error={errors && errors.excuse_category}
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-3">
        <label className="font-medium">Country</label>
        <Controller
          name="country_id"
          control={control}
          render={({ field }) => (
            <CountrySelect
              onChangeValue={(value) => field.onChange(value)}
              value={field.value}
              error={errors && errors.country_id}
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex items-center">
          <label className="flex-1 font-medium">Technician</label>
          <div className="flex items-center gap-2">
            <Controller
              name="all_technicians"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="all_technicians"
                  className="rounded-none w-[17px] h-[17px]"
                  defaultChecked={false}
                  onCheckedChange={(value: any) => field.onChange(value)}
                />
              )}
            />
            <label htmlFor="all_technicians">All</label>
          </div>
        </div>
        <Controller
          name="user_id"
          control={control}
          render={({ field }) => (
            <TechnicianSelect
              multiple={true}
              onChangeValue={(value: any) => field.onChange(value)}
              value={field.value}
              error={errors && errors.user_id}
            />
          )}
        />
      </div>
      <div className="flex w-full gap-3">
        <div className="flex-1 flex flex-col gap-3">
          <label className="font-medium">From</label>
          <Controller
            name="excuse_from_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                date={field.value ? new Date(field.value) : undefined}
                onChangeDate={(date) => field.onChange(date)}
                format="dd-MM-yyyy"
                error={errors && errors.excuse_from_date}
              />
            )}
          />
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <label className="font-medium">To</label>
          <Controller
            name="excuse_to_date"
            control={control}
            render={({ field }) => (
              <DatePicker
                triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                date={field.value ? new Date(field.value) : undefined}
                onChangeDate={(date) => field.onChange(date)}
                format="dd-MM-yyyy"
                error={errors && errors.excuse_to_date}
              />
            )}
          />
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <label className="font-medium">Reason</label>
        <Textarea
          className="bg-stone-100 border-transparent"
          placeholder="Enter location"
          error={errors && (errors.excuse_reason ? true : false)}
          {...register("excuse_reason")}
        />
        <span className="text-red-500">
          {errors?.excuse_reason && errors?.excuse_reason.message?.toString()}
        </span>
      </div>

      <Button type="submit" className="block w-full" variant={"red"}>
        {id ? "Update" : "Save"}
      </Button>
    </form>
  );
};
