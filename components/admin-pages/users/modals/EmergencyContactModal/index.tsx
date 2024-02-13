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
import Pagination from "@/components/pagination";
import { DeleteContact } from "./delete-contact";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

const yupObject: any = {
  uec_firstname: yup.string().required('This field is required.'),
  uec_lastname: yup.string().required('This field is required.'),
  uec_middlename: yup.string().required('This field is required.'),
  uec_relationship: yup.string().required('This field is required.'),
  uec_telephone_number: yup.string().required('This field is required.'),
  uec_mobile_number: yup.string().required('This field is required.'),
};
function EmergencyContact(props: EmergencyContactProps) {
  const { data: session }: any = useSession();
  const router = useRouter();
  const { open, onOpenChange, user } = props;
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState("none");
  const [onEdit, setOnEdit] = useState(false);
  const [deleteContact, setDeleteContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const yupSchema = yup.object(yupObject);

  const { data, isLoading, error } = useSWR(open ? '/api/user/' + user.user_id + '/emergency_contact/get' : null, fetcher, swrOptions);
  console.log({ user: data })
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control,
    reset
  } = useForm({
    resolver: yupResolver(yupSchema)
  });

  const onSave = async (data: any) => {
    try {
      data.uec_status = 'active';
      data.user_id = user.user_id;

      const res = await fetch(`${baseUrl}/api/users/emergency_contact/add/${user.user_id}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(session.user.access_token)
      })

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "Contact Successfully Added.",
          variant: 'success',
          duration: 2000
        });
        mutate('/api/user/' + user.user_id + '/emergency_contact/get');
        reset();
      }
    } catch (error) {
      console.log({ error: error })
      toast({
        title: "Error uppon adding contact.",
        variant: 'destructive',
        duration: 2000
      });
    }
  }

  const onUpdate = async (data: any) => {
    try {
      const res = await fetch(`${baseUrl}/api/users/emergency_contact/edit/${selectedContact.uec_id}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(session.user.access_token)
      })

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "Contact Successfully Edited.",
          variant: 'success',
          duration: 2000
        });
        mutate('/api/user/' + user.user_id + '/emergency_contact/get');
        reset();
      }
    } catch (error) {
      console.log({ error: error })
      toast({
        title: "Error uppon editing contact.",
        variant: 'destructive',
        duration: 2000
      });
    }
  }

  function onClickAction(action: any, contact: any) {
    if (action === "edit") {
      setOpenForm("block");
      setOnEdit(true);
      setSelectedContact(contact);
      setValue('uec_firstname', contact.uec_firstname);
      setValue('uec_lastname', contact.uec_lastname);
      setValue('uec_middlename', contact.uec_middlename);
      setValue('uec_relationship', contact.uec_relationship);
      setValue('uec_telephone_number', contact.uec_telephone_number);
      setValue('uec_mobile_number', contact.uec_mobile_number);
    } else if (action === "delete") {
      setSelectedContact(contact);
      setDeleteContact(true);
    }
  }

  function contactEvent(event: any) {
    if (event === "add") {
      setOpenForm("block");
      setOnEdit(false);
      reset();
    } else if (event === "close-form") {
      setOpenForm("none");
    }
  }

  const onPaginate = (page: string) => {
    router.query.page = page;
    router.push(router);
  };

  return (
    <>
      <DeleteContact
        open={deleteContact}
        onOpenChange={(open: any) => setDeleteContact(open)}
        contact={selectedContact}
      />
      <Dialog
        open={open}
        onOpenChange={(open) => {
          onOpenChange && onOpenChange(open);
        }}
      >
        <DialogContent className="max-w-[1200px] p-2 overflow-auto gap-0 "
        >
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
            <DialogTitle className="flex gap-2 items-center">
              Emergency Contacts
              <p className="text-stone-400 text-base">({user && user.user_firstname} {user && user.user_lastname})</p>
            </DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <div style={{ display: openForm }}>
            <form action="" method="POST" onSubmit={handleSubmit(onEdit ? onUpdate : onSave)}>
              <div className="p-3 grid grid-cols-3 gap-3">
                <div className="flex flex-col gap-3">
                  <label className="font-medium">First Name</label>
                  <Input
                    className="bg-stone-100 border-transparent"
                    error={errors && (errors.uec_firstname ? true : false)}
                    {...register("uec_firstname")}
                  />
                  {errors.uec_firstname && (
                    <span className="text-red-500 text-sm">
                      <>{errors.uec_firstname?.message}</>
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-medium">Last Name</label>
                  <Input
                    className="bg-stone-100 border-transparent"
                    error={errors && (errors.uec_lastname ? true : false)}
                    {...register("uec_lastname")}
                  />
                  {errors.uec_lastname && (
                    <span className="text-red-500 text-sm">
                      <>{errors.uec_lastname?.message}</>
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-medium">Middle Name</label>
                  <Input
                    className="bg-stone-100 border-transparent"
                    error={errors && (errors.uec_middlename ? true : false)}
                    {...register("uec_middlename")}
                  />
                  {errors.uec_middlename && (
                    <span className="text-red-500 text-sm">
                      <>{errors.uec_middlename?.message}</>
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-medium">Relationship</label>
                  <Input
                    className="bg-stone-100 border-transparent"
                    error={errors && (errors.uec_relationship ? true : false)}
                    {...register("uec_relationship")}
                  />
                  {errors.uec_relationship && (
                    <span className="text-red-500 text-sm">
                      <>{errors.uec_relationship?.message}</>
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-medium">Telephone Number</label>
                  <Input
                    className="bg-stone-100 border-transparent"
                    error={errors && (errors.uec_telephone_number ? true : false)}
                    {...register("uec_telephone_number")}
                  />
                  {errors.uec_telephone_number && (
                    <span className="text-red-500 text-sm">
                      <>{errors.uec_telephone_number?.message}</>
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-3">
                  <label className="font-medium">Mobile Number</label>
                  <Input
                    className="bg-stone-100 border-transparent"
                    error={errors && (errors.uec_mobile_number ? true : false)}
                    {...register("uec_mobile_number")}
                  />
                  {errors.uec_mobile_number && (
                    <span className="text-red-500 text-sm">
                      <>{errors.uec_mobile_number?.message}</>
                    </span>
                  )}
                </div>
              </div>
              <DialogFooter className="flex justify-items-end p-3">
                <Button variant={'ghost'} type="button"
                  onClick={() => contactEvent("close-form")}
                >
                  Close
                </Button>
                <Button
                  type="submit"
                  className={cn(loading && 'loading w-[20%] bg-stone-600')}
                >{onEdit ? "Update" : "Save"}</Button>
              </DialogFooter>
            </form>
          </div>
          <div className="p-3">
            <table className="border-spacing-y-[5px] category-container w-full">
              <thead>
                <tr>
                  <TH>First Name</TH>
                  <TH>Last Name</TH>
                  <TH>Middle Name</TH>
                  <TH>Relationship</TH>
                  <TH>Telephone Number</TH>
                  <TH>Mobile Number</TH>
                  <TH></TH>
                </tr>
              </thead>
              <tbody>
                {data && data.contacts && data.contacts.map((contact: any, key: any) => (
                  <tr key={key}>
                    <TD>{contact.uec_firstname}</TD>
                    <TD>{contact.uec_lastname}</TD>
                    <TD>{contact.uec_middlename}</TD>
                    <TD>{contact.uec_relationship}</TD>
                    <TD>{contact.uec_telephone_number}</TD>
                    <TD>{contact.uec_mobile_number}</TD>
                    <TD>
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="p-1 text-stone-400 border-0 bg-transparent h-auto rounded-full">
                            <MoreHorizontal className="w-5 h-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="border border-stone-50">
                          {[...actionMenu].map((action, key) => (
                            <ItemMenu key={key} onClick={() => onClickAction(action.actionType, contact)}>
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
          {data && data.pager && (
            <div className="mt-auto border-t border-t-stone-100">
              <Pagination
                pager={data.pager}
                onPaginate={(page: any) => onPaginate(page)}
              />
            </div>
          )}
          <DialogFooter className="justify-items-end p-2" style={{ display: openForm === "none" ? "flex" : "none" }}>
            <Button variant={'ghost'} type="button"
              onClick={() => contactEvent("add")}
            >
              Add Contact
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default memo(EmergencyContact);

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

type EmergencyContactProps = {
  open?: any,
  onOpenChange?: (open: any) => void,
  user?: any
}