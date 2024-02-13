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
import FamilyTab from "../../userId/FamilyTab";

function FamilyDetail(props: FamilyDetailProps) {
  const { data: session }: any = useSession();
  const router = useRouter();
  const { open, onOpenChange, user } = props;
  const [loading, setLoading] = useState(false);
  const [openForm, setOpenForm] = useState("none");
  const [onEdit, setOnEdit] = useState(false);
  const [deleteContact, setDeleteContact] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => {
          onOpenChange && onOpenChange(open);
        }}
      >
        <DialogContent className="max-w-[1000px] p-2 overflow-auto gap-0 "
        >
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
            <DialogTitle className="flex gap-2 items-center">
              Family Details
              <p className="text-stone-400 text-base">({user && user.user_firstname} {user && user.user_lastname})</p>
            </DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <div className="flex py-2 bg-white shadow-sm rounded-xl px-3 mb-2 gap-1 sticky top-[calc(var(--header-height)+4px)]">
            <FamilyTab
              user={user}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default memo(FamilyDetail);

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

type FamilyDetailProps = {
  open?: any,
  onOpenChange?: (open: any) => void,
  user?: any
}