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
import { DeleteUserReference } from "../../modals/AdditionalInfoModal/delete_reference";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

const yupObject: any = {
  user_reference_name: yup.string().required('This field is required.'),
  user_reference_company: yup.string().required('This field is required.'),
  user_reference_contact: yup.string().required('This field is required.'),
};

function ReferenceTab(props: ReferenceTabProps) {
  const { data: session }: any = useSession();
  const router = useRouter();
  const { activeTab, user } = props;
  const [_user, setUser] = useState(user);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [selectedUserReference, setSelectedUserReference] = useState(null);
  const [selectedReferenceID, setSelectedReferenceID] = useState(null);
  const [onDeleteReference, setOnDeleteReference] = useState(false);
  const yupSchema = yup.object(yupObject);

  const { data, isLoading, error } = useSWR(activeTab ? '/api/user/' + user.user_id + '/additional_info/get_references' : null, fetcher, swrOptions);
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
    data.user_reference_status = 'active';
    const res = await fetch(`${baseUrl}/api/users/additional_info/add_reference`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: authHeaders(session.user.access_token)
    });

    const json = await res.json();

    if (json.success) {
      toast({
        title: "Reference Successfuly Added.",
        variant: 'success',
        duration: 2000
      });
      setUser(json.data);
      mutate('/api/user/' + user.user_id + '/additional_info/get_references');
      reset();
    }
  }

  async function onUpdate(data: any) {
    setLoadingSubmit(true);

    const res = await fetch(`${baseUrl}/api/users/additional_info/update_reference/${selectedReferenceID}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: authHeaders(session.user.access_token)
    });

    const json = await res.json();

    if (json.success) {
      toast({
        title: "Reference Successfuly Updated.",
        variant: 'success',
        duration: 2000
      });
      setUser(json.data);
      mutate('/api/user/' + user.user_id + '/additional_info/get_references');
      setOnEdit(false);
      reset();
    }
  }

  function onClickAction(action: any, reference: any) {
    if (action === 'edit') {
      setValue('user_reference_name', reference && reference.user_reference_name);
      setValue('user_reference_company', reference && reference.user_reference_company);
      setValue('user_reference_contact', reference && reference.user_reference_contact);
      setOnEdit(true);
      setSelectedReferenceID(reference.user_reference_id)

    } else {
      setOnEdit(false);
      setSelectedUserReference(reference);
      setOnDeleteReference(true);
    }
  }

  function referenceEvent(event: any) {
    if (event === "close") {
      setOnEdit(false);
      reset();
    }
  }

  return (
    <div className="py-2 bg-white shadow-sm rounded-xl px-3 mb-2 gap-1 mt-2">
      {selectedUserReference && (
        <DeleteUserReference
          open={onDeleteReference}
          onOpenChange={(open: any) => setOnDeleteReference(open)}
          reference={selectedUserReference && selectedUserReference}
        />
      )}
      <form action="" method="post" onSubmit={handleSubmit(onEdit ? onUpdate : onSave)}>
        <div className="p-3 grid grid-cols-4 gap-3">
          <div className="flex flex-col gap-3">
            <label className="font-medium">Reference Name</label>
            <Input
              className="bg-stone-100 border-transparent"
              error={errors && (errors.user_reference_name ? true : false)}
              {...register("user_reference_name")}
            />
            {errors.user_reference_name && (
              <span className="text-red-500 text-sm">
                <>{errors.user_reference_name?.message}</>
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-medium">Company</label>
            <Input
              className="bg-stone-100 border-transparent"
              error={errors && (errors.user_reference_company ? true : false)}
              {...register("user_reference_company")}
            />
            {errors.user_reference_company && (
              <span className="text-red-500 text-sm">
                <>{errors.user_reference_company?.message}</>
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-medium">Contact</label>
            <Input
              className="bg-stone-100 border-transparent"
              error={errors && (errors.user_reference_contact ? true : false)}
              {...register("user_reference_contact")}
            />
            {errors.user_reference_contact && (
              <span className="text-red-500 text-sm">
                <>{errors.user_reference_contact?.message}</>
              </span>
            )}
          </div>
          <div className="flex items-end mb-1 justify-start sticky">
            {onEdit ?
              <Button variant={'ghost'} type="button"
                onClick={() => referenceEvent("close")}
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
              <TH className="text-center">Name</TH>
              <TH className="text-center">Company</TH>
              <TH className="text-center">Contact</TH>
              <TH className="text-center"></TH>
            </tr>
          </thead>
          <tbody>
            {data && data.map((reference: any, key: any) => (
              <tr key={key}>
                <TD>{reference.user_reference_name}</TD>
                <TD>{reference.user_reference_company}</TD>
                <TD>{reference.user_reference_contact}</TD>
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

export default memo(ReferenceTab);

type ReferenceTabProps = {
  activeTab?: any,
  user?: any
}