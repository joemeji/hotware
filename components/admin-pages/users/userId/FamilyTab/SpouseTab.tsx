import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { memo, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { CivilStatusSelect } from "../../form-elements/CivilStatusSelect";
import { DatePicker } from "@/components/ui/datepicker";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { TD, TH } from "@/components/items";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { ItemMenu } from "@/components/LoadingList";
import useSWR, { mutate } from "swr";
import { authHeaders, baseUrl, fetcher } from "@/utils/api.config";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

const yupObject: any = {
  user_civil_status: yup.string().required('This field is required.'),
  user_spouse_name: yup.string().required('This field is required.'),
  user_spouse_job_status: yup.string().required('This field is required.'),
  user_spouse_birthdate: yup.date().required('This field is required.'),
  user_spouse_job_entry: yup.date().required('This field is required.'),
};

function SpouseTab(props: SpouseTabProps) {
  const { data: session }: any = useSession();
  const router = useRouter();
  const { activeTab, user } = props;
  const [_user, setUser] = useState(user);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [selectedCivilStatus, setSelectedCivilStatus] = useState<string | null>(null);
  const yupSchema = yup.object(yupObject);

  console.log({ user: user })

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
    defaultValues: {
      user_civil_status: _user && _user.user_civil_status,
      user_spouse_name: _user && _user.user_spouse_name,
      user_spouse_job_status: _user && _user.user_spouse_job_status,
      user_spouse_birthdate: _user && _user.user_spouse_birthdate,
      user_spouse_job_entry: _user && _user.user_spouse_job_entry
    }
  });

  async function onSubmitForm(data: any) {
    setLoadingSubmit(true);
    data.timezone = dayjs.tz.guess();
    const res = await fetch(`${baseUrl}/api/users/family/update_spouse/${user.user_id}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: authHeaders(session.user.access_token)
    });

    const json = await res.json();

    if (json.success) {
      toast({
        title: "Spouse Successfuly Updated.",
        variant: 'success',
        duration: 2000
      });
      setUser(json.data);
      mutate(baseUrl + '/api/users/');
    }
  }

  const civilStatusChangeHandler = (value: string) => {
    setSelectedCivilStatus(value);
  };

  useEffect(() => {
    if (_user) {
      setValue('user_civil_status', _user && _user.user_civil_status);
      setValue('user_spouse_name', _user && _user.user_spouse_name);
      setValue('user_spouse_job_status', _user && _user.user_spouse_job_status);
      setValue('user_spouse_birthdate', _user && _user.user_spouse_birthdate);
      setValue('user_spouse_job_entry', _user && _user.user_spouse_job_entry);
      setSelectedCivilStatus(_user && _user.user_civil_status);
    }
  }, [_user, setValue])

  return (
    <div className="py-2 bg-white shadow-sm rounded-xl px-3 mb-2 gap-1 mt-2">
      <form action="" method="post" onSubmit={handleSubmit(onSubmitForm)}>
        <div className="p-3 grid grid-cols-3 gap-3">
          <div className="flex flex-col gap-3">
            <label className="font-medium">Civil Status</label>
            <Controller
              name="user_civil_status"
              control={control}
              render={({ field }) => (
                <CivilStatusSelect
                  value={field.value}
                  onChangeValue={(value: any) => {
                    field.onChange(value);
                    civilStatusChangeHandler(value);
                  }}
                />
              )}
            />
          </div>
          {selectedCivilStatus === 'Single' || selectedCivilStatus === 'Divorced' ? <div className="flex flex-col gap-3"></div> : (
            <>
              <div className="flex flex-col gap-3">
                <label className="font-medium">Spouse Name</label>
                <Input
                  className="bg-stone-100 border-transparent"
                  error={errors && (errors.user_spouse_name ? true : false)}
                  {...register("user_spouse_name")}
                />
                {errors.user_spouse_name && (
                  <span className="text-red-500 text-sm">
                    <>{errors.user_spouse_name?.message}</>
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-medium">Spouse Birthday</label>
                <Controller
                  name="user_spouse_birthdate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                      date={field.value ? new Date(field.value) : undefined}
                      onChangeDate={date => field.onChange(date)}
                      format="dd-MM-yyyy"
                      error={errors && errors.user_spouse_birthdate}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-medium">Job Status</label>
                <Input
                  className="bg-stone-100 border-transparent"
                  error={errors && (errors.user_spouse_job_status ? true : false)}
                  {...register("user_spouse_job_status")}
                />
                {errors.user_spouse_job_status && (
                  <span className="text-red-500 text-sm">
                    <>{errors.user_spouse_job_status?.message}</>
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <label className="font-medium">Job Entry</label>
                <Controller
                  name="user_spouse_job_entry"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                      date={field.value ? new Date(field.value) : undefined}
                      onChangeDate={date => field.onChange(date)}
                      format="dd-MM-yyyy"
                      error={errors && errors.user_spouse_job_entry}
                    />
                  )}
                />
              </div>

            </>
          )}
          <div className="flex gap-3 items-end justify-end sticky">
            <Button
              type="submit"
              className={cn(loading && 'loading w-[20%] bg-stone-600')}
            >{onEdit ? "Update" : "Save"}</Button>
          </div>
        </div>
      </form>
    </div>
  )
}

const actionMenu = [
  {
    name: "Edit",
    actionType: "edit",
    icon: <Pencil className={cn("mr-2 h-[18px] w-[18px] text-orange-400")} />
  },
  {
    name: "Delete",
    actionType: "delete",
    icon: <Trash className={cn("mr-2 h-[18px] w-[18px] text-red-400")} />
  },
]

export default memo(SpouseTab);

type SpouseTabProps = {
  activeTab?: any,
  user?: any
}