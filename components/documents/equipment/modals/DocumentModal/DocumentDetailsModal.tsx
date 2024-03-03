import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApiDocumentLanguageSelect from "@/components/app/api-document-language-select";
import DocumentCategorySelect from "@/components/app/document-category-select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import InputFile from "@/components/ui/input-file";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";

function DocumentDetail(props: DocumentDetailProps) {
  const router = useRouter();
  const { open, onOpenChange, document } = props;
  let modifiedDate = "";
  const padZero = (value: any) => {
    return value < 10 ? `0${value}` : value;
  };

  if (document.modified_date) {
    const date = new Date(document.modified_date);
    modifiedDate = `${date.getFullYear()}-${padZero(
      date.getMonth() + 1
    )}-${padZero(date.getDate())}`;
  } else {
    modifiedDate = "";
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => onOpenChange && onOpenChange(open)}
      >
        <DialogContent
          forceMount
          className="max-w-[500px] p-2 overflow-auto gap-0"
        >
          <DialogHeader>
            <div className="py-2 px-3 flex justify-between flex-row items-start sticky top-0 bg-background z-10">
              <DialogTitle>
                <div className="flex flex-col gap-1">
                  <span>Document Details</span>
                </div>
              </DialogTitle>
              <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
                <X />
              </DialogPrimitive.Close>
            </div>
          </DialogHeader>
          <div className="p-2 rounded-app gap-3 bg-stone-100">
            <div className="bg-white p-2 flex flex-col gap-2">
              <div className="p-2 flex gap-4 shadow-2xl">
                <p className="font-medium">Name:</p>
                <p>{document.name}</p>
              </div>
              <div className="p-2 flex gap-4 shadow-2xl">
                <p className="font-medium">Description:</p>
                <p>{document.document_description}</p>
              </div>
              <div className="p-2 flex gap-4 shadow-2xl">
                <p className="font-medium">Language:</p>
                <p>{document.language}</p>
              </div>
              <div className="p-2 flex gap-4 shadow-2xl">
                <p className="font-medium">Category:</p>
                <p>{document.category}</p>
              </div>
              <div className="p-2 flex gap-4 shadow-2xl">
                <p className="font-medium">Expiry Date:</p>
                <p>{document.expiry_date}</p>
              </div>
              <div className="flex justify-between">
                <div className="p-2 flex gap-4 shadow-2xl">
                  <p className="font-medium">Modified By:</p>
                  <p>{document.modified_by}</p>
                </div>
                <div className="p-2 flex gap-4 shadow-2xl">
                  <p className="font-medium">Modified Date:</p>
                  <p>
                    {document.modified_date
                      ? format(
                          formatDate(document.modified_date).getTime(),
                          "yyyy/MM/dd"
                        )
                      : ""}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const formatDate = (dateString: any) => {
  const year = parseInt(dateString.substring(0, 4));
  const month = parseInt(dateString.substring(4, 6)) - 1; // Months are zero-indexed
  const day = parseInt(dateString.substring(6, 8));
  const hours = parseInt(dateString.substring(8, 10));
  const minutes = parseInt(dateString.substring(10, 12));
  const seconds = parseInt(dateString.substring(12, 14));

  const dateObject = new Date(year, month, day, hours, minutes, seconds);
  return dateObject;
};

export default memo(DocumentDetail);

type DocumentDetailProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  document?: any;
};
