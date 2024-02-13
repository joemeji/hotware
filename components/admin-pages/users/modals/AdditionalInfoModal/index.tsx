import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React, { memo, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { MoreHorizontal, Pencil, Trash, X } from "lucide-react";
import AdditionalTab from "../../userId/AdditionalTab";

function AdditionalInfo(props: AdditionalInfoProps) {
  const { open, onOpenChange, user } = props;

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
              Additonal Info
              <p className="text-stone-400 text-base">({user && user.user_firstname} {user && user.user_lastname})</p>
            </DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <div className="flex py-2 bg-white shadow-sm rounded-xl px-3 mb-2 gap-1 sticky top-[calc(var(--header-height)+4px)]">
            <AdditionalTab
              user={user}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default memo(AdditionalInfo);

type AdditionalInfoProps = {
  open?: any,
  onOpenChange?: (open: any) => void,
  user?: any
}