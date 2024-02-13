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
import { MoreHorizontal, Pencil, Save, Trash, X } from "lucide-react";
import { ItemMenu } from "@/components/LoadingList";
import useSWR, { mutate } from "swr";
import { authHeaders, baseUrl, fetcher } from "@/utils/api.config";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { avatarFallback } from "@/utils/avatar";
import { Textarea } from "@/components/ui/textarea";
import ErrorFormMessage from "@/components/app/error-form-message";
import { DeleteUserObjective } from "../../modals/AdditionalInfoModal/delete";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

const yupObject: any = {
  user_objective: yup.string().required('This field is required.'),
};

function ObjectiveTab(props: ObjectiveTabProps) {
  const { data: session }: any = useSession();
  const router = useRouter();
  const { activeTab, user } = props;
  const [_user, setUser] = useState(user);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [onDeleteObjectiveModal, setOnDeleteObjectiveModal] = useState(false);
  const [selectedCivilStatus, setSelectedCivilStatus] = useState<string | null>(null);
  const yupSchema = yup.object(yupObject);

  const { data, isLoading, error } = useSWR(activeTab ? '/api/user/' + user.user_id + '/details' : null, fetcher, swrOptions);
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
      user_objective: user && user.user_objective,
    }
  });

  async function onUpdate(data: any) {
    setLoadingSubmit(true);

    const res = await fetch(`${baseUrl}/api/users/additional_info/update_objective/${user.user_info_id}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: authHeaders(session.user.access_token)
    });

    const json = await res.json();

    if (json.success) {
      toast({
        title: "Objective Successfuly Updated.",
        variant: 'success',
        duration: 2000
      });
      setUser(json.data);
      mutate('/api/user/' + user.user_id + '/details');
    }
  }

  function onclickEventIcons(event: any) {
    if (event === "save") {
      setOnEdit(false);
    } else if (event === "edit") {
      setOnEdit(true);
    } else if (event === "delete") {
      setOnDeleteObjectiveModal(true);
    } else if (event === "cancel") {
      setOnEdit(false);
      setValue('user_objective', data && data.user_objective);
    }
  }

  useEffect(() => {
    if (data) {
      setValue('user_objective', data && data.user_objective);
    }
  }, [data, setValue]);

  return (
    <div className="py-2 bg-white shadow-sm rounded-xl px-4 mb-2 gap-1 mt-2">
      {onDeleteObjectiveModal && (
        <DeleteUserObjective
          open={onDeleteObjectiveModal}
          onOpenChange={(open: any) => setOnDeleteObjectiveModal(open)}
          objective={user && user}
        />
      )}
      <form action="" method="post" onSubmit={handleSubmit(onUpdate)}>
        <div className="flex items-center justify-end gap-1 mr-2">
          {onEdit ?
            <X className="text-red-400 font-medium p-1 rounded-app hover:bg-stone-100 hover:cursor-pointer"
              height={30}
              onClick={() => onclickEventIcons('cancel')}
            />
            : null}
          <button
            onClick={() => onclickEventIcons('save')}
            type="submit"
          >
            <Save className="text-green-400 font-medium p-1 rounded-app hover:bg-stone-100 hover:cursor-pointer"
              height={30}
              onClick={() => onclickEventIcons('save')}
            />
          </button>

          {onEdit ? null :
            <Pencil className="text-orange-400 font-medium p-1 rounded-app hover:bg-stone-100 hover:cursor-pointer"
              height={30}
              onClick={() => onclickEventIcons('edit')}
            />
          }
          <Trash className="text-rose-400 font-medium p-1 rounded-app hover:bg-stone-100 hover:cursor-pointer"
            height={30}
            onClick={() => onclickEventIcons('delete')}
          />
        </div>
        <div className="flex gap-4">
          <Avatar className="w-24 h-24 border-4 border-white mt-2">
            <AvatarImage src={`${baseUrl}/users/thumbnail/${user.user_photo}`} alt={user.user_lastname + ' ' + user.user_lastname} />
            <AvatarFallback className="font-medium text-white text-2xl" style={{ background: '#4f46e5' }}>
              {avatarFallback(user.user_firstname, user.user_lastname)}
            </AvatarFallback>
          </Avatar>
          <div className="border-stone-300 border-2 p-2 w-full h-[20vh] mt-2 rounded-xl" style={{ borderTopLeftRadius: 0 }}>

            <Textarea
              disabled={onEdit ? false : true}
              className="bg-stone-100 font-medium border-0 h-[18vh] max-h-[18vh]"
              {...register('user_objective')}
              error={(errors && errors.user_objective) ? true : false}
            />
            {errors.user_objective && (
              <ErrorFormMessage message={errors.user_objective?.message} />
            )}

          </div>
        </div>
      </form>
    </div >
  )
}

export default memo(ObjectiveTab);

type ObjectiveTabProps = {
  activeTab?: any,
  user?: any
}