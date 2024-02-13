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
import { DeleteChild } from "./delete-child";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

const yupObject: any = {
  user_child_first_name: yup.string().required('This field is required.'),
  user_child_last_name: yup.string().required('This field is required.'),
  user_child_birthdate: yup.date().required('This field is required.'),
};

function SpouseTab(props: SpouseTabProps) {
  const { data: session }: any = useSession();
  const router = useRouter();
  const { activeTab, user } = props;
  const [_user, setUser] = useState(user);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [selectedUserChild, setSelectedUserChild] = useState(null);
  const [selectedChildID, setSelectedChildID] = useState(null);
  const [onDeleteChild, setOnDeleteChild] = useState(false);
  const yupSchema = yup.object(yupObject);

  const { data, isLoading, error } = useSWR(activeTab ? '/api/user/' + user.user_id + '/family/get_child' : null, fetcher, swrOptions);
  console.log({ user: data })

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
    const res = await fetch(`${baseUrl}/api/users/family/add_child/${user.user_id}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: authHeaders(session.user.access_token)
    });

    const json = await res.json();

    if (json.success) {
      toast({
        title: "Child Successfuly Added.",
        variant: 'success',
        duration: 2000
      });
      setUser(json.data);
      mutate('/api/user/' + user.user_id + '/family/get_child');
    }
  }

  async function onUpdate(data: any) {
    setLoadingSubmit(true);
    data.timezone = dayjs.tz.guess();
    const res = await fetch(`${baseUrl}/api/users/family/update_child/${selectedChildID}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: authHeaders(session.user.access_token)
    });

    const json = await res.json();

    if (json.success) {
      toast({
        title: "Children Successfuly Updated.",
        variant: 'success',
        duration: 2000
      });
      setUser(json.data);
      mutate('/api/user/' + user.user_id + '/family/get_child');
      setOnEdit(false);
    }
  }

  function onClickAction(action: any, child: any) {
    if (action === 'edit') {
      console.log({ child: child })
      setValue('user_child_first_name', child && child.user_child_first_name);
      setValue('user_child_last_name', child && child.user_child_last_name);
      setValue('user_child_birthdate', child && child.user_child_birthdate);
      setOnEdit(true);
      setSelectedChildID(child.user_child_id)

    } else {
      setOnEdit(false);
      setSelectedUserChild(child);
      setOnDeleteChild(true);
    }
  }

  function childEvent(event: any) {
    if (event === "close") {
      setOnEdit(false);
      reset();
    }
  }

  return (
    <div className="py-2 bg-white shadow-sm rounded-xl px-3 mb-2 gap-1 mt-2">
      <DeleteChild
        open={onDeleteChild}
        onOpenChange={(open: any) => setOnDeleteChild(open)}
        child={selectedUserChild && selectedUserChild}
      />
      <form action="" method="post" onSubmit={handleSubmit(onEdit ? onUpdate : onSave)}>
        <div className="p-3 grid grid-cols-4 gap-3">
          <div className="flex flex-col gap-3">
            <label className="font-medium">First Name</label>
            <Input
              className="bg-stone-100 border-transparent"
              error={errors && (errors.user_child_first_name ? true : false)}
              {...register("user_child_first_name")}
            />
            {errors.user_child_first_name && (
              <span className="text-red-500 text-sm">
                <>{errors.user_child_first_name?.message}</>
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-medium">Last Name</label>
            <Input
              className="bg-stone-100 border-transparent"
              error={errors && (errors.user_child_last_name ? true : false)}
              {...register("user_child_last_name")}
            />
            {errors.user_child_last_name && (
              <span className="text-red-500 text-sm">
                <>{errors.user_child_last_name?.message}</>
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-medium">Birthdate</label>
            <Controller
              name="user_child_birthdate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center"
                  date={field.value ? new Date(field.value) : undefined}
                  onChangeDate={date => field.onChange(date)}
                  format="dd-MM-yyyy"
                  error={errors && errors.user_child_birthdate}
                />
              )}
            />
          </div>
          <div className="flex items-end mb-1 justify-start sticky">
            {onEdit ?
              <Button variant={'ghost'} type="button"
                onClick={() => childEvent("close")}
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
              <TH>First Name</TH>
              <TH>Last Name</TH>
              <TH>Birthdate</TH>
              <TH></TH>
            </tr>
          </thead>
          <tbody>
            {data && data.map((child: any, key: any) => (
              <tr key={key}>
                <TD>{child.user_child_first_name}</TD>
                <TD>{child.user_child_last_name}</TD>
                <TD>{child.user_child_birthdate}</TD>
                <TD>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="p-1 text-stone-400 border-0 bg-transparent h-auto rounded-full">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border border-stone-50">
                      {[...actionMenu].map((action, key) => (
                        <ItemMenu key={key} onClick={() => onClickAction(action.actionType, child)}>
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

export default memo(SpouseTab);

type SpouseTabProps = {
  activeTab?: any,
  user?: any
}