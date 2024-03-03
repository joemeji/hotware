import AvatarProfile from "@/components/AvatarProfile";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { baseUrl } from "@/utils/api.config";
import dayjs from "dayjs";
import { Check, Pencil, X } from "lucide-react";
import Link from "next/link";
import { memo, useState } from "react";
import { StatusChip } from "@/components/PurchaseOrder/StatusChip";
import { getPurchaseStatus, isOpen } from "@/lib/purchase";
import { toast } from "@/components/ui/use-toast";
import { mutate } from "swr";
import { useApproval } from "./useApproval";
import { useDecline } from "./useDecline";
import SendApprovalEmail from "@/components/projects/send-email/SendApprovalEmail";

function PurchaseDetails({ data, sessData }: PurchaseDetailsProps) {
  return (
    <>
      <div className="w-1/4 h-[calc(100vh-var(--header-height)-40px)] top-[calc(var(--header-height)+20px)] rounded-sm overflow-hidden sticky">
        <ScrollArea
          className={cn(
            "bg-white",
            " p-5 h-[calc(100vh-var(--header-height)-40px)]"
          )}
        >
          {data && (
            <>
              <p className="text-xl font-bold mb-4 sticky top-0 bg-white z-10">
                {data && data.po_description}
              </p>
              <Details data={data} sessData={sessData}/>
            </>
          )}
        </ScrollArea>

        {data && isOpen(data) && (
          <Link href={`/purchase-order/${data._po_id}/edit`}>
            <Button
              className={cn(
                "absolute bottom-3 right-3 flex items-center drop-shadow-xl gap-2"
              )}
            >
              <Pencil className="w-5 h-5 text-white" />
              <span className="text-white font-medium">Edit</span>
            </Button>
          </Link>
        )}
      </div>
    </>
  );
}


export default memo(PurchaseDetails);

function Details({ data, sessData }: { data: any, sessData:any }) {
  const { mutateApprove, Dialog: ApproveDialog } = useApproval({
    onApprove: () => {
      toast({
        title: "Purchase order has been approved successfully.",
        variant: "success",
        duration: 2000,
      });

      mutate([`/api/purchases/details/${data._po_id}`, sessData?.data.user?.access_token]);
      // send email after approving
      SendApprovalEmail(data._po_id, 'sendApprovalStatusEmail', sessData?.data.user?.access_token); 
    },
  });

  const { mutateDecline, Dialog: DeclineDialog } = useDecline({
    onDecline: () => {
      toast({
        title: "Purchase order has been declined successfully.",
        variant: "success",
        duration: 2000,
      });

      mutate([`/api/purchases/details/${data._po_id}`, sessData?.data.user?.access_token]);
      // send email after declining
      SendApprovalEmail(data._po_id, 'sendApprovalStatusEmail', sessData?.data.user?.access_token);
    },
  });

  return (
    <>
      <ApproveDialog />
      <DeclineDialog />

      {(data._user_id == sessData.data.user.id && data.po_status == 'approval') && (
        <div className="flex gap-1 mb-8 mt-8">
          <Button
            onClick={() => mutateApprove(data._po_id)}
            className={cn("flex items-center bg-green-600 w-full drop-shadow-xl")}
          >
            <Check className=" text-white" />
            <span className="text-white font-medium">APPROVE</span>
          </Button>
          <Button
            onClick={() => mutateDecline(data._po_id)}
            className={cn("flex items-center bg-red-600 w-full drop-shadow-x")}
          >
            <X className="text-white" />
            <span className="text-white font-medium">DECLINE</span>
          </Button>
        </div>
      )}

      <Detail className="gap-2">
        <p className="text-sm text-right flex gap-1">
          Created at
          <span className="font-medium">
            {data.added_date
              ? dayjs(data.added_date).format("MMM DD, YYYY HH:ss a")
              : "-"}
          </span>
        </p>

        <div className="flex gap-1 items-center">
          <span className="text-sm text-stone-600">by</span>
          <div className="flex gap-1 items-center">
            <AvatarProfile
              firstname={data.user_firstname}
              lastname={data.user_lastname}
              photo={baseUrl + "/users/thumbnail/" + data.user_photo}
              avatarClassName="w-6 h-6"
              avatarColor={data.avatar_color}
              avatarFallbackClassName="font-medium text-white text-xs"
            />
            <span className="text-sm font-medium flex">
              {data.user_firstname + " " + data.user_lastname}
            </span>
          </div>
        </div>
      </Detail>

      <div className="border-2 border-stone-100 p-3 flex justify-between items-center rounded-xl mb-3">
        <p className="text-sm font-medium text-stone-500">Status</p>
        <StatusChip status={getPurchaseStatus(data)} />
      </div>
      <Detail>
        <p className="text-sm font-medium text-stone-500">Invoice To</p>
        <div>
          <p className="font-bold">{data.client || ""}</p>
          {data.cms_address_building && <p>{data.cms_address_building}</p>}
          {data.cms_address_street && <p>{data.cms_address_street}</p>}
          <p>
            {data.cms_address_city ? data.cms_address_city + ", " : ""}
            {data.cms_address_country || ""}
          </p>
        </div>
      </Detail>
      <Detail>
        <p className="text-sm font-medium text-stone-500">Deliver To</p>
        <div>
          <p className="font-bold">{data.delivery || ""}</p>
          {data.delivery_address_building && (
            <p>{data.delivery_address_building}</p>
          )}
          {data.delivery_address_street && (
            <p>{data.delivery_address_street}</p>
          )}
          <p>
            {data.delivery_address_city
              ? data.delivery_address_city + ", "
              : ""}
            {data.delivery_country || ""}
          </p>
        </div>
      </Detail>
      <Detail>
        <p className="text-sm font-medium text-stone-500">Payment Terms</p>
        <div>
          <p className="font-bold">{data.payment_terms_name || "-"}</p>
        </div>
      </Detail>

      <Detail>
        <p className="text-sm font-medium text-stone-500">Shipping Method</p>
        <div>
          <p className="font-bold">
            {data.shipping_method_name || "-"}
            {/* {data.shipping_delivery_date ? dayjs(data.shipping_delivery_date).format('MMMM DD, YYYY') : '-'} */}
          </p>
        </div>
      </Detail>

      <Detail>
        <p className="text-sm font-medium text-stone-500">Currency</p>
        <div>
          <p className="font-bold">{data.currency || "-"}</p>
        </div>
      </Detail>

      <Detail className="mb-0">
        <p className="text-sm font-medium text-stone-500">VAT</p>
        <div>
          <p className="font-bold">
            {data.po_is_exclusive_vat == 1 ? "Exclusive VAT" : "Inclusive VAT"}
          </p>
        </div>
      </Detail>

      <Detail className="mb-0">
        <p className="text-sm font-medium text-stone-500">
          Purchase Order Date
        </p>
        <div>
          <p className="font-bold">
            {data.po_date ? dayjs(data.po_date).format("MMMM DD, YYYY") : "-"}
          </p>
        </div>
      </Detail>

      <Detail className="mb-0">
        <p className="text-sm font-medium text-stone-500">Document Date</p>
        <div>
          <p className="font-bold">
            {data.po_document_date
              ? dayjs(data.po_document_date).format("MMMM DD, YYYY")
              : "-"}
          </p>
        </div>
      </Detail>
    </>
  );
}

function Detail({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "border-2 border-stone-100 p-3 flex flex-col gap-3 rounded-xl mb-3",
        className
      )}
    >
      {children}
    </div>
  );
}

type PurchaseDetailsProps = {
  data?: any;
  sessData?: any;
};
