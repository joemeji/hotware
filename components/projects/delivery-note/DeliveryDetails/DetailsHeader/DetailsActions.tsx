import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FileSearch,
  MoreHorizontal,
  History,
  Trash2,
  FileText,
  FileOutput,
} from "lucide-react";
import React, { memo, useState } from "react";
import { useSWRConfig } from "swr";
import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import { previewPdf } from "@/services/projects/delivery";
import { useSession } from "next-auth/react";
import { useDelete } from "@/components/projects/delivery-note/useDelete";
import { isClosed } from "@/lib/delivery";
import { useCopy } from "@/components/projects/delivery-note/useCopy";
import { useChangeStatus } from "@/components/projects/delivery-note/useChangeStatus";
import { useCreateOrderConfirmation } from "@/components/projects/delivery-note/useCreateOrderConfirmation";
import { useCreateOffer } from "@/components/projects/delivery-note/useCreateOffer";
import { useCreateInvoice } from "@/components/projects/delivery-note/useCreateInvoice";
import { useCreateShippingList } from "@/components/projects/delivery-note/useCreateShippingList";
import { CreateOrderConfirmationButton } from "@/components/projects/buttons/CreateOrderConfirmationButton";
import { CreateOfferButton } from "@/components/projects/buttons/CreateOfferButton";
import { CreateInvoiceButton } from "@/components/projects/buttons/CreateInvoiceButton";
import { CreateShippingListButton } from "@/components/projects/buttons/CreateShippingListButton";
import { Copy } from "lucide-react";

const ActivityLogSheetModal = dynamic(
  () => import("../../modals/ActivityLogSheetModal")
);

type DetailsActionsParams = {
  _delivery_note_id: string | undefined;
  data: any;
};

function DetailsActions({ _delivery_note_id, data }: DetailsActionsParams) {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { data: session }: any = useSession();
  const [activityOpen, setActivityOpen] = useState(false);
  const { mutateDelete, Dialog: DeleteDialog } = useDelete({
    onDelete: () => {
      toast({
        title: "Delivery note has been deleted successfully.",
        variant: "success",
        duration: 2000,
      });
      mutate(
        [`/api/projects/deliveries?`, session?.user?.access_token],
        undefined
      );
      setTimeout(() => {
        router.push("/projects/delivery-note");
      }, 300);
    },
  });

  const { mutateCopy, Dialog: CopyDialog } = useCopy({
    onCopy: (item: string) => {
      mutate(
        [`/api/projects/deliveries?`, session?.user?.access_token],
        undefined
      );

      router.push(`/projects/delivery-note/${item}`);
    },
  });

  const {
    mutateCreate: mutateCreateOrderConfirmation,
    Dialog: OrderConfirmationDialog,
  } = useCreateOrderConfirmation({
    onSuccess: (item: string) => {
      router.push(`/projects/order-confirmation/${item}`);
    },
  });

  const { mutateChange, Dialog: ChangeStatusDialog } = useChangeStatus({
    onChange: (item: string) => {
      mutate(
        [
          `/api/projects/deliveries/details/${_delivery_note_id}`,
          session?.user?.access_token,
        ],
        undefined
      );
    },
  });

  const { mutateCreate: mutateCreateInvoice, Dialog: InvoiceDialog } =
    useCreateInvoice({
      onSuccess: (item: string) => {
        router.push(`/projects/invoices/${item}`);
      },
    });

  const { mutateCreate: mutateCreateOffer, Dialog: OfferDialog } =
    useCreateOffer({
      onSuccess: (item: string) => {
        router.push(`/projects/offers/${item}`);
      },
    });

  const { mutateCreate: mutateCreateShipping, Dialog: ShippingDialog } =
    useCreateShippingList({
      onSuccess: (item: string) => {
        router.push(`/projects/shipping-list/${item}`);
      },
    });

  const onPreviewPdf = async (_delivery_note_id: any) => {
    const res = await previewPdf(
      _delivery_note_id,
      session?.user?.access_token
    );
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectURL;
    a.target = "_blank";
    a.click();
  };

  const onDownloadPdf = async (_delivery_note_id: any) => {
    const res = await previewPdf(
      _delivery_note_id,
      session?.user?.access_token
    );
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);
    let filename = res.headers.get("Title");
    const a = document.createElement("a");
    a.href = objectURL;
    a.download = (filename as string) + ".pdf";
    a.click();
  };

  return (
    <React.Fragment>
      <DeleteDialog />
      <CopyDialog />
      <OrderConfirmationDialog />
      <OfferDialog />
      <InvoiceDialog />
      <ShippingDialog />
      <ChangeStatusDialog />
      <ActivityLogSheetModal
        _delivery_note_id={_delivery_note_id}
        open={activityOpen}
        onOpenChange={(open: any) => setActivityOpen(open)}
      />
      <div className="flex items-center gap-1">
        <DetailAction onClick={() => onPreviewPdf(_delivery_note_id)}>
          <FileSearch className="w-4 h-4 mr-2" strokeWidth={1} />
          Preview
        </DetailAction>
        <MoreOption
          menuTriggerChildren={
            <DetailAction>
              <MoreHorizontal className="w-5 h-5" strokeWidth={1} />
            </DetailAction>
          }
        >
          <ItemMenu
            onClick={() => mutateCopy(_delivery_note_id)}
            className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
          >
            <Copy className="w-[18px] h-[18px] text-teal-500" />
            <span className="text-sm font-medium">Copy</span>
          </ItemMenu>
          {data && !isClosed(data) ? (
            <>
              <ItemMenu
                onClick={() => mutateChange(_delivery_note_id)}
                className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
              >
                <FileOutput className="w-[18px] h-[18px] text-rose-500" />
                <span className="text-sm font-medium">Change Status</span>
              </ItemMenu>
              <DetailActionDropdownItem
                label="Delete"
                onClick={() => mutateDelete(_delivery_note_id)}
                icon={<Trash2 className="w-[18px] h-[18px] text-red-500" />}
              />
            </>
          ) : null}
          <Separator className="my-2" />
          <CreateOfferButton
            _offer_id={data?.delivery_note_has_offer}
            onCreate={() => mutateCreateOffer(_delivery_note_id)}
          />
          <CreateOrderConfirmationButton
            _order_confirmation_id={data?.delivery_note_has_order_confirmation}
            onCreate={() => mutateCreateOrderConfirmation(_delivery_note_id)}
          />
          <CreateInvoiceButton
            _invoice_id={data?.delivery_note_has_invoice}
            invoice_number={data?.delivery_note_original_number}
            onCreate={() => mutateCreateInvoice(_delivery_note_id)}
          />
          <CreateShippingListButton
            _shipping_id={data?.delivery_note_has_shipping}
            onCreate={() => mutateCreateShipping(_delivery_note_id)}
          />
          <Separator className="my-2" />
          <ItemMenu
            className="gap-3"
            onClick={() => onDownloadPdf(_delivery_note_id)}
          >
            <FileText className="w-[18px] h-[18px] text-red-500" />
            <span className="font-medium">Save as Pdf</span>
          </ItemMenu>
          <DetailActionDropdownItem
            onClick={() => setActivityOpen(true)}
            label="History"
            icon={<History className="w-[18px] h-[18px] text-blue-500" />}
          />
        </MoreOption>
      </div>
    </React.Fragment>
  );
}

export default memo(DetailsActions);

const DetailAction = React.forwardRef((props: ButtonProps, ref: any) => {
  const { className, children, ...rest } = props;
  return (
    <Button
      ref={ref}
      size={"sm"}
      variant="secondary"
      className={cn("py-1.5", className)}
      {...rest}
    >
      {children}
    </Button>
  );
});

DetailAction.displayName = "DetailAction";

function DetailActionDropdownItem({
  onClick,
  label,
  icon,
}: {
  onClick?: (e?: any) => void;
  label?: string;
  icon?: any;
}) {
  return (
    <ItemMenu className="px-3 py-2 flex gap-3" onClick={onClick}>
      {icon}
      <span className="font-medium">{label}</span>
    </ItemMenu>
  );
}
