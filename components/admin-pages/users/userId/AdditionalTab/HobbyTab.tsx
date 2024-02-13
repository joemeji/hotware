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
import { DeleteUserHobby } from "../../modals/AdditionalInfoModal/delete_hobby";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

const yupObject: any = {
  user_hobby: yup.string().required('This field is required.'),
};

function HobbyTab(props: HobbyTabProps) {
  const { data: session }: any = useSession();
  const router = useRouter();
  const { activeTab, user } = props;
  const [_user, setUser] = useState(user);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [selectedUserHobby, setSelectedUserHobby] = useState(null);
  const [selectedHobbyID, setSelectedHobbyID] = useState(null);
  const [onDeleteHobby, setOnDeleteHobby] = useState(false);
  const yupSchema = yup.object(yupObject);

  const { data, isLoading, error } = useSWR(activeTab ? '/api/user/' + user.user_id + '/additional_info/get_hobbies' : null, fetcher, swrOptions);
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
    data.user_id = user.user_id;
    data.user_hobby_status = 'active';
    const res = await fetch(`${baseUrl}/api/users/additional_info/add_hobby`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: authHeaders(session.user.access_token)
    });

    const json = await res.json();

    if (json.success) {
      toast({
        title: "Hobby Successfuly Added.",
        variant: 'success',
        duration: 2000
      });
      setUser(json.data);
      mutate('/api/user/' + user.user_id + '/additional_info/get_hobbies');
      reset();
    }
  }

  async function onUpdate(data: any) {
    setLoadingSubmit(true);

    const res = await fetch(`${baseUrl}/api/users/additional_info/update_hobby/${selectedHobbyID}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: authHeaders(session.user.access_token)
    });

    const json = await res.json();

    if (json.success) {
      toast({
        title: "Hobby Successfuly Updated.",
        variant: 'success',
        duration: 2000
      });
      setUser(json.data);
      mutate('/api/user/' + user.user_id + '/additional_info/get_hobbies');
      setOnEdit(false);
      reset();
    }
  }

  function onClickAction(action: any, hobby: any) {
    if (action === 'edit') {
      setValue('user_hobby', hobby && hobby.user_hobby);
      setOnEdit(true);
      setSelectedHobbyID(hobby.user_hobby_id)

    } else {
      setOnEdit(false);
      setSelectedUserHobby(hobby);
      setOnDeleteHobby(true);
    }
  }

  function hobbyEvent(event: any) {
    if (event === "close") {
      setOnEdit(false);
      reset();
    }
  }

  return (
    <div className="py-2 bg-white shadow-sm rounded-xl px-3 mb-2 gap-1 mt-2">
      {selectedUserHobby && (
        <DeleteUserHobby
          open={onDeleteHobby}
          onOpenChange={(open: any) => setOnDeleteHobby(open)}
          hobby={selectedUserHobby && selectedUserHobby}
        />
      )}
      <form action="" method="post" onSubmit={handleSubmit(onEdit ? onUpdate : onSave)}>
        <div className="p-3 grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-3">
            <label className="font-medium">Hobby</label>
            <Input
              className="bg-stone-100 border-transparent"
              error={errors && (errors.user_hobby ? true : false)}
              {...register("user_hobby")}
            />
            {errors.user_hobby && (
              <span className="text-red-500 text-sm">
                <>{errors.user_hobby?.message}</>
              </span>
            )}
          </div>
          <div className="flex items-end mb-1 justify-start sticky">
            {onEdit ?
              <Button variant={'ghost'} type="button"
                onClick={() => hobbyEvent("close")}
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
              <TH className="text-center">Hobby</TH>
              <TH className="text-center">Action</TH>
            </tr>
          </thead>
          <tbody>
            {data && data.map((hobby: any, key: any) => (
              <tr key={key}>
                <TD>{hobby.user_hobby}</TD>
                <TD>
                  <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="p-1 text-stone-400 border-0 bg-transparent h-auto rounded-full">
                        <MoreHorizontal className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="border border-stone-50">
                      {[...actionMenu].map((action, key) => (
                        <ItemMenu key={key} onClick={() => onClickAction(action.actionType, hobby)}>
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

export default memo(HobbyTab);

type HobbyTabProps = {
  activeTab?: any,
  user?: any
}