import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React, { memo, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { MoreHorizontal, Pencil, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "@/components/ui/input";
import { TD, TH } from "@/components/items";
import useSWR, { mutate } from "swr";
import { authHeaders, baseUrl, fetcher } from "@/utils/api.config";
import { tr } from "date-fns/locale";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ItemMenu } from "@/components/LoadingList";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { DeleteUserLanguage } from "./delete";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

const yupObject: any = {
  user_mother_language: yup.string(),
  user_fluent_reading: yup.string(),
  user_understanding: yup.string(),
  user_learning: yup.string(),
};

function UserLanguageModal(props: UserLanguageModalProps) {
  const { data: session }: any = useSession();
  const router = useRouter();
  const { open, onOpenChange, user } = props;
  const [loading, setLoading] = useState(false);
  const [onEdit, setOnEdit] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [selectedUserLanguageID, setSelectedUserLanguageID] = useState(null);
  const [onDeleteModal, setOnDeleteModal] = useState(false);
  const [userLanguage, setUserLanguage] = useState(false);
  const yupSchema = yup.object(yupObject);

  const { data, isLoading, error } = useSWR(open ? '/api/user/' + user.user_id + '/user_language/get' : null, fetcher, swrOptions);
  console.log({ data: data })
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(yupSchema)
  });

  async function onSave(data: any) {
    console.log({ input: data });
    const allInputsEmpty = Object.values(data).every((value) => !value);

    if (allInputsEmpty) {
      toast({
        title: "Cannot submit empty form! Please fill in the required fields.",
        variant: 'destructive',
        duration: 2000
      });
      return;
    }

    data.user_id = user.user_id;

    const res = await fetch(`${baseUrl}/api/users/user_language/add/${user.user_id}`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: authHeaders(session.user.access_token)
    });

    const json = await res.json();

    if (json.success) {
      toast({
        title: "Language Successfuly Added.",
        variant: 'success',
        duration: 2000
      });
      mutate('/api/user/' + user.user_id + '/user_language/get');
      reset();
    }
  }

  async function onUpdate(data: any) {
    const res = await fetch(`${baseUrl}/api/users/user_language/edit/${selectedUserLanguageID}`, {
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
      mutate('/api/user/' + user.user_id + '/user_language/get');
      reset();
    }
  }

  function onClickAction(action: any, lang: any) {
    if (action === "edit") {
      setOpenForm(true);
      setOnEdit(true);
      setValue('user_mother_language', lang.user_mother_language);
      setValue('user_fluent_reading', lang.user_fluent_reading);
      setValue('user_understanding', lang.user_understanding);
      setValue('user_learning', lang.user_learning);
      setSelectedUserLanguageID(lang.user_language_id);
    } else {
      setOnDeleteModal(true);
      setUserLanguage(lang);
    }
  }

  function openFormEvent(event: any) {
    if (event) {
      setOpenForm(true);
    } else {
      setOpenForm(false);
    }
    reset();
  }

  return (
    <>
      {onDeleteModal && (
        <DeleteUserLanguage
          open={onDeleteModal}
          onOpenChange={(open: any) => setOnDeleteModal(open)}
          language={userLanguage && userLanguage}
        />
      )}
      <Dialog
        open={open}
        onOpenChange={(open) => {
          onOpenChange && onOpenChange(open);
        }}
      >
        <DialogContent className="max-w-[1000px] p-2 overflow-auto gap-0"
        >
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
            <DialogTitle className="flex gap-2 items-center">
              User Languages
              <p className="text-stone-400 text-base">({user && user.user_firstname} {user && user.user_lastname})</p>
            </DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <div className="flex py-2 bg-white shadow-sm rounded-xl px-3 mb-2 gap-1 sticky top-[calc(var(--header-height)+4px)]">
            <div className="bg-stone-100 p-2 w-full rounded">
              <form action="" method="post" onSubmit={handleSubmit(onEdit ? onUpdate : onSave)} style={{ display: openForm ? 'block' : 'none' }}>
                <div className="bg-white p-3 grid grid-cols-2 gap-3 rounded-app">
                  <div className="flex flex-col gap-3">
                    <label className="font-medium">Mother Language</label>
                    <Input
                      className="bg-stone-100 border-transparent"
                      error={errors && (errors.user_mother_language ? true : false)}
                      {...register("user_mother_language")}
                    />
                    {errors.user_mother_language && (
                      <span className="text-red-500 text-sm">
                        <>{errors.user_mother_language?.message}</>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="font-medium">Fluent Reading</label>
                    <Input
                      className="bg-stone-100 border-transparent"
                      error={errors && (errors.user_fluent_reading ? true : false)}
                      {...register("user_fluent_reading")}
                    />
                    {errors.user_fluent_reading && (
                      <span className="text-red-500 text-sm">
                        <>{errors.user_fluent_reading?.message}</>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="font-medium">Understanding</label>
                    <Input
                      className="bg-stone-100 border-transparent"
                      error={errors && (errors.user_understanding ? true : false)}
                      {...register("user_understanding")}
                    />
                    {errors.user_understanding && (
                      <span className="text-red-500 text-sm">
                        <>{errors.user_understanding?.message}</>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <label className="font-medium">Learning</label>
                    <Input
                      className="bg-stone-100 border-transparent"
                      error={errors && (errors.user_learning ? true : false)}
                      {...register("user_learning")}
                    />
                    {errors.user_learning && (
                      <span className="text-red-500 text-sm">
                        <>{errors.user_learning?.message}</>
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-3"></div>
                  <div className="flex gap-3 items-end justify-end sticky">
                    <Button variant={'ghost'} type="button"
                      onClick={() => openFormEvent(false)}
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
              <div className="bg-white p-3 rounded-app mt-2">
                <table className="border-spacing-y-[5px] category-container w-full">
                  <thead>
                    <tr>
                      <TH>Mother Language</TH>
                      <TH>Fluent Reading</TH>
                      <TH>Understanding</TH>
                      <TH>Learning</TH>
                      <TH></TH>
                    </tr>
                  </thead>
                  <tbody>
                    {data && data.map((lang: any, index: number) => (
                      <tr key={index}>
                        <TD>{lang.user_mother_language}</TD>
                        <TD>{lang.user_fluent_reading}</TD>
                        <TD>{lang.user_understanding}</TD>
                        <TD>{lang.user_learning}</TD>
                        <TD>
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="p-1 text-stone-400 border-0 bg-transparent h-auto rounded-full">
                                <MoreHorizontal className="w-5 h-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="border border-stone-50">
                              {[...actionMenu].map((action, key) => (
                                <ItemMenu key={key} onClick={() => onClickAction(action.actionType, lang)}>
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
              <DialogFooter className="justify-items-end p-2">
                <Button variant={'ghost'} type="button"
                  onClick={() => openFormEvent(true)}
                >
                  Add Parents
                </Button>
              </DialogFooter>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default memo(UserLanguageModal);

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

type UserLanguageModalProps = {
  open?: any,
  onOpenChange?: (open: any) => void,
  user?: any
}