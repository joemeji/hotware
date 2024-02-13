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
import { DeleteChild } from "./delete-child";
import { DialogFooter } from "@/components/ui/dialog";
import { ParentSelect } from "../../form-elements/ParentSelect";
import { DeleteParent } from "./delete-parent";
import { set } from "lodash";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

const yupObject: any = {
  family_firstname: yup.string().required('This field is required.'),
  family_lastname: yup.string().required('This field is required.'),
  family_work: yup.string().required('This field is required.'),
  family_relation: yup.string().required('This field is required.'),
};

function SpouseTab(props: SpouseTabProps) {
  const { data: session }: any = useSession();
  const router = useRouter();
  const { activeTab, user } = props;
  const [_user, setUser] = useState(user);
  const [loading, setLoading] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [selectedUserParent, setSelectedUserParent] = useState(null);
  const [onDeleteChild, setOnDeleteChild] = useState(false);
  const [familyRelation, setFamilyRelation] = useState(null);
  const yupSchema = yup.object(yupObject);

  const { data, isLoading, error } = useSWR(activeTab ? '/api/user/' + user.user_id + '/family/get_parent' : null, fetcher, swrOptions);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control,
    reset,
    getValues
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  async function onSave(data: any) {
    setLoadingSubmit(true);
    const res = await fetch(`${baseUrl}/api/users/family/add_parent/${user.user_id}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: authHeaders(session.user.access_token)
    });

    const json = await res.json();

    if (json.success) {
      toast({
        title: "Parent Successfuly Added.",
        variant: 'success',
        duration: 2000
      });
      setUser(json.data);
      mutate('/api/user/' + user.user_id + '/family/get_parent');
    }
  }

  function onClickAction(action: any, parent: any, relation: any) {
    if (action === 'edit') {
      setOnEdit(true);
      setOpenForm(true);
      if (relation === 'Mother') {
        setValue('family_firstname', parent && parent.user_family_f_fname);
        setValue('family_lastname', parent && parent.user_family_f_lname);
        setValue('family_work', parent && parent.user_family_f_status);
      } else {
        setValue('family_firstname', parent && parent.user_family_m_fname);
        setValue('family_lastname', parent && parent.user_family_m_lname);
        setValue('family_work', parent && parent.user_family_m_status);
      }
      setValue('family_relation', relation);
    } else {
      setOnEdit(false);
      setOnDeleteChild(true);
      setSelectedUserParent(parent);
      reset();
    }
    setFamilyRelation(relation);
  }

  function childEvent(event: any) {
    if (event === "close") {
      setOpenForm(false);
      reset();
    }
  }

  function openFormEvent() {
    setOpenForm(true);
    setOnEdit(false);
    reset();
  }

  return (
    <div className="py-2 bg-white shadow-sm rounded-xl px-3 mb-2 gap-1 mt-2">
      <DeleteParent
        open={onDeleteChild}
        onOpenChange={(open: any) => setOnDeleteChild(open)}
        parent={selectedUserParent && selectedUserParent}
        relation={familyRelation}
      />
      <form action="" method="post" onSubmit={handleSubmit(onSave)} style={{ display: openForm ? "block" : "none" }}>
        <div className="p-3 grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-3">
            <label className="font-medium">First Name</label>
            <Input
              className="bg-stone-100 border-transparent"
              error={errors && (errors.family_firstname ? true : false)}
              {...register("family_firstname")}
            />
            {errors.family_firstname && (
              <span className="text-red-500 text-sm">
                <>{errors.family_firstname?.message}</>
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-medium">Last Name</label>
            <Input
              className="bg-stone-100 border-transparent"
              error={errors && (errors.family_lastname ? true : false)}
              {...register("family_lastname")}
            />
            {errors.family_lastname && (
              <span className="text-red-500 text-sm">
                <>{errors.family_lastname?.message}</>
              </span>
            )}
          </div>
          <div className="flex flex-col gap-3">
            <label className="font-medium">Work</label>
            <Input
              className="bg-stone-100 border-transparent"
              error={errors && (errors.family_work ? true : false)}
              {...register("family_work")}
            />
            {errors.family_work && (
              <span className="text-red-500 text-sm">
                <>{errors.family_work?.message}</>
              </span>
            )}
          </div>
          {onEdit ? null :
            <>
              <div className="flex flex-col gap-3">
                <label className="font-medium">Relationship</label>
                <Controller
                  name="family_relation"
                  control={control}
                  render={({ field }) => (
                    <ParentSelect
                      value={field.value}
                      onChangeValue={(value: any) => {
                        field.onChange(value);
                      }}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-3"></div>
            </>
          }
          <div className="flex items-center mb-1 justify-end sticky">
            <Button variant={'ghost'} type="button"
              onClick={() => childEvent("close")}
            >
              Cancel
            </Button>
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
              <TH>Work</TH>
              <TH>Relationship</TH>
              <TH></TH>
            </tr>
          </thead>
          {data !== undefined && data.length > 0 ? (
            <tbody>
              {data[0].user_family_f_fname !== null && data[0].user_family_f_fname !== '' ? (
                <tr>
                  <TD>{data[0].user_family_f_fname}</TD>
                  <TD>{data[0].user_family_f_lname}</TD>
                  <TD>{data[0].user_family_f_status}</TD>
                  <TD>Mother</TD>
                  <TD>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="p-1 text-stone-400 border-0 bg-transparent h-auto rounded-full">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border border-stone-50">
                        {[...actionMenu].map((action, key) => (
                          <ItemMenu key={key} onClick={() => onClickAction(action.actionType, data[0], 'Mother')}>
                            {action.icon}
                            <span className="text-stone-600 text-sm">{action.name}</span>
                          </ItemMenu>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TD>
                </tr>
              ) : null}
              {data[0].user_family_m_fname !== null && data[0].user_family_m_fname !== '' ? (
                <tr>
                  <TD>{data[0].user_family_m_fname}</TD>
                  <TD>{data[0].user_family_m_lname}</TD>
                  <TD>{data[0].user_family_m_status}</TD>
                  <TD>Father</TD>
                  <TD>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="p-1 text-stone-400 border-0 bg-transparent h-auto rounded-full">
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="border border-stone-50">
                        {[...actionMenu].map((action, key) => (
                          <ItemMenu key={key} onClick={() => onClickAction(action.actionType, data[0], 'Father')}>
                            {action.icon}
                            <span className="text-stone-600 text-sm">{action.name}</span>
                          </ItemMenu>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TD>
                </tr>
              ) : null}

            </tbody>
          ) : <tr><td colSpan={5} className="text-center p-2"> No Records Found.</td></tr>}
        </table>
      </div>
      <DialogFooter className="justify-items-end p-2">
        <Button variant={'ghost'} type="button"
          onClick={() => openFormEvent()}
        >
          Add Parents
        </Button>
      </DialogFooter>
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