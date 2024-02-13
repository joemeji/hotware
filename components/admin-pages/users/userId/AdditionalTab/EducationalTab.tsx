import { Input } from "@/components/ui/input";
import { yupResolver } from "@hookform/resolvers/yup";
import { memo, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
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
import { DeleteUserEducational } from "../../modals/AdditionalInfoModal/delete_educational";
import { SchoolLevelSelect } from "../../form-elements/SchooLevelSelect";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

const yupObject: any = {
  school_level: yup.string().required('This field is required.'),
  school_name: yup.string().required('This field is required.'),
  year_started: yup.date().required('This field is required.'),
  year_graduated: yup.date().required('This field is required.'),
};

function EducationalTab(props: EducationalTabProps) {
  const { data: session }: any = useSession();
  const router = useRouter();
  const { activeTab, user } = props;
  const [_user, setUser] = useState(user);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [selectedUserEducational, setSelectedUserEducational] = useState(null);
  const [selectedEducationalID, setSelectedEducationalID] = useState(null);
  const [onDeleteEducational, setOnDeleteEducational] = useState(false);
  const yupSchema = yup.object(yupObject);

  const { data, isLoading, error } = useSWR(activeTab ? '/api/user/' + user.user_id + '/additional_info/get_education' : null, fetcher, swrOptions);
  console.log({ hobby: data })

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
    setLoadingSubmit(true);
    data.timezone = dayjs.tz.guess();
    data.user_id = user.user_id;
    data.user_education_status = 'active';
    const res = await fetch(`${baseUrl}/api/users/additional_info/add_education`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: authHeaders(session.user.access_token)
    });

    const json = await res.json();

    if (json.success) {
      toast({
        title: "Education Successfuly Added.",
        variant: 'success',
        duration: 2000
      });
      setUser(json.data);
      mutate('/api/user/' + user.user_id + '/additional_info/get_education');
      reset();
    }
  }

  async function onUpdate(data: any) {
    setLoadingSubmit(true);
    data.timezone = dayjs.tz.guess();
    const res = await fetch(`${baseUrl}/api/users/additional_info/update_education/${selectedEducationalID}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: authHeaders(session.user.access_token)
    });

    const json = await res.json();

    if (json.success) {
      toast({
        title: "Education Successfuly Updated.",
        variant: 'success',
        duration: 2000
      });
      setUser(json.data);
      mutate('/api/user/' + user.user_id + '/additional_info/get_education');
      setOnEdit(false);
      reset();
    }
  }

  function onClickAction(action: any, reference: any) {
    if (action === 'edit') {
      setValue('school_level', reference && reference.school_level);
      setValue('school_name', reference && reference.school_name);
      setValue('year_started', reference && reference.year_started);
      setValue('year_graduated', reference && reference.year_graduated);
      setOnEdit(true);
      setSelectedEducationalID(reference.user_education_id)

    } else {
      setOnEdit(false);
      setSelectedUserEducational(reference);
      setOnDeleteEducational(true);
    }
  }

  function educationEvent(event: any) {
    if (event === "close") {
      setOnEdit(false);
      reset();
    }
  }

  return (
    <div className="py-2 bg-white shadow-sm rounded-xl px-3 mb-2 gap-1 mt-2">
      {selectedUserEducational && (
        <DeleteUserEducational
          open={onDeleteEducational}
          onOpenChange={(open: any) => setOnDeleteEducational(open)}
          education={selectedUserEducational && selectedUserEducational}
        />
      )}
      <form action="" method="post" onSubmit={handleSubmit(onEdit ? onUpdate : onSave)}>
        <div className="p-3 grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-3">
            <label className="font-medium">Level</label>
            <Controller
              name="school_level"
              control={control}
              render={({ field }) => (
                <SchoolLevelSelect
                  value={field.value}
                  onChangeValue={(value: any) => field.onChange(value)}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-medium">School / University</label>
            <Input
              className="bg-stone-100 border-transparent"
              error={errors && (errors.school_name ? true : false)}
              {...register("school_name")}
            />
            {errors.school_name && (
              <span className="text-red-500 text-sm">
                <>{errors.school_name?.message}</>
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-medium">Year Started</label>
            <Controller
              name="year_started"
              control={control}
              render={({ field }) => (
                <DatePicker
                  triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                  date={field.value ? new Date(field.value) : undefined}
                  onChangeDate={date => field.onChange(date)}
                  format="dd-MM-yyyy"
                  error={errors && errors.year_started}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-medium">Year Graduated</label>
            <Controller
              name="year_graduated"
              control={control}
              render={({ field }) => (
                <DatePicker
                  triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                  date={field.value ? new Date(field.value) : undefined}
                  onChangeDate={date => field.onChange(date)}
                  format="dd-MM-yyyy"
                  error={errors && errors.year_graduated}
                />
              )}
            />
          </div>
          <div className="flex flex-col gap-3"></div>
          <div className="flex items-end mb-1 justify-end sticky">
            {onEdit ?
              <Button variant={'ghost'} type="button"
                onClick={() => educationEvent("close")}
              >
                Cancel
              </Button>
              : null}

            <Button
              type="submit"
              className={cn(loading && 'loading w-[20%] bg-stone-600')}
            >{onEdit ? "Update" : "Save"}</Button>
          </div>
        </div>
      </form>
      <div className="p-3">
        <table className="border-spacing-y-[5px] category-container w-full">
          <thead>
            <tr>
              <TH>Level</TH>
              <TH>School</TH>
              <TH>Year Started</TH>
              <TH>Year Graduated</TH>
              <TH></TH>
            </tr>
          </thead>
          <tbody>
            {data && data.map((reference: any, key: any) => (
              <tr key={key}>
                <TD>{reference.school_level}</TD>
                <TD>{reference.school_name}</TD>
                <TD>{reference.year_started}</TD>
                <TD>{reference.year_graduated}</TD>
                <TD>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="p-1 text-stone-400 border-0 bg-transparent h-auto rounded-full">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border border-stone-50">
                      {[...actionMenu].map((action, key) => (
                        <ItemMenu key={key} onClick={() => onClickAction(action.actionType, reference)}>
                          {action.icon}
                          <span className="text-stone-600 text-sm">{action.name}</span>
                        </ItemMenu>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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

export default memo(EducationalTab);

type EducationalTabProps = {
  activeTab?: any,
  user?: any
}