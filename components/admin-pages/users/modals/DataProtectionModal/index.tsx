import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React, { memo, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { MoreHorizontal, Pencil, Trash, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Controller, useForm } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import InputFile from "@/components/ui/input-file";
import { base } from "@/lib/azureUrls";
import dayjs from "dayjs";
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(timezone);

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

const yupObject: any = {
  gpdr_file: yup.mixed(),
  consent_file: yup.mixed(),
  signature_file: yup.mixed(),
};
function EmergencyContact(props: EmergencyContactProps) {
  const { data: session }: any = useSession();
  const router = useRouter();
  const { open, onOpenChange, user } = props;
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState("none");
  const [onEdit, setOnEdit] = useState(false);
  const [deleteContact, setDeleteContact] = useState(false);
  const [enableGPDR, setEnableGPDR] = useState(false);
  const [enableConsent, setEnableConsent] = useState(false);
  const [enableSignature, setEnableSignature] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const yupSchema = yup.object(yupObject);

  const { data, isLoading, error } = useSWR(open ? '/api/user/' + user.user_id + '/data_protection/get' : null, fetcher, swrOptions);
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

  const gdprItem = data?.find((item: any) => item.user_consent_type === "gdpr");
  const consentItem = data?.find((item: any) => item.user_consent_type === "consent");
  const signatureItem = data?.find((item: any) => item.user_consent_type === "signature");

  const onSave = async (data: any) => {
    try {
      const formData = new FormData();
      for (let [key, value] of Object.entries(data)) {
        formData.append(key, value as string);
      }
      formData.append('gdprEnable', JSON.stringify(enableGPDR));
      formData.append('consentEnable', JSON.stringify(enableConsent));
      formData.append('signatureEnable', JSON.stringify(enableSignature));
      const res = await fetch(`${baseUrl}/api/users/data_protection/save/${user.user_id}`, {
        method: "POST",
        body: formData,
        headers: authHeaders(session.user.access_token, true)
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

  function onClickViewAttachedFile(consent: any) {
    console.log({ consent: consent })
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          onOpenChange && onOpenChange(open);
        }}
      >
        <DialogContent className="max-w-[500px] p-2 overflow-auto gap-0 "
        >
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
            <DialogTitle className="flex gap-2 items-center">
              Data Protection
              <p className="text-stone-400 text-base">({user && user.user_firstname} {user && user.user_lastname})</p>
            </DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <form action="" method="POST" onSubmit={handleSubmit(onSave)}>
            <div className="p-3 flex flex-col gap-3">
              <div className="flex flex-col gap-3">
                <label className="flex gap-3 font-medium text-base">
                  <Switch
                    onCheckedChange={(e: any) => setEnableGPDR(e)}
                  />
                  Hotwork GDPR
                </label>
                <div className="mr-5 flex gap-3" style={{ marginLeft: '58px' }}>
                  <p>Attached File :</p>
                  <a className="text-blue-400 underline underline-offset-4 hover:cursor-pointer" target="_blank" href={base + '/users/' + (gdprItem?.user_consent_reference)}>{gdprItem?.user_consent_reference}</a>
                </div>
                <Controller
                  name="gdpr_file"
                  control={control}
                  render={({ field }) => (
                    <InputFile
                      disabled={enableGPDR ? false : true}
                      accept="image/*"
                      onChange={(value: any) => field.onChange(value[0])}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="flex font-medium text-base gap-3">
                  <Switch
                    onCheckedChange={(e: any) => setEnableConsent(e)}
                  />
                  Hotwork Consent
                </label>
                <div className="flex gap-3" style={{ marginLeft: '58px' }}>
                  <p>Attached File :</p>
                  <a className="text-blue-400 underline underline-offset-4 hover:cursor-pointer" target="_blank" href={base + '/users/' + (consentItem?.user_consent_reference)}>{consentItem?.user_consent_reference}</a>
                </div>
                <Controller
                  name="consent_file"
                  control={control}
                  render={({ field }) => (
                    <InputFile
                      disabled={enableConsent ? false : true}
                      accept="image/*"
                      onChange={(value: any) => field.onChange(value[0])}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="flex font-medium text-base gap-3">
                  <Switch
                    onCheckedChange={(e: any) => setEnableSignature(e)}
                  />
                  Electronic Signature
                </label>
                <div className="flex gap-3" style={{ marginLeft: '58px' }}>
                  <p>Attached File :</p>
                  <a className="text-blue-400 underline underline-offset-4 hover:cursor-pointer" target="_blank" href={base + '/users/' + (signatureItem?.user_consent_reference)}>{signatureItem?.user_consent_reference}</a>
                </div>
                <Controller
                  name="signature_file"
                  control={control}
                  render={({ field }) => (
                    <InputFile
                      disabled={enableSignature ? false : true}
                      accept="image/*"
                      onChange={(value: any) => field.onChange(value[0])}
                    />
                  )}
                />
              </div>
              <DialogFooter className="flex justify-items-end p-3">
                <Button
                  type="submit"
                  className={cn(loading && 'loading w-[20%] bg-stone-600')}
                >Save</Button>
              </DialogFooter>
            </div>
          </form>
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