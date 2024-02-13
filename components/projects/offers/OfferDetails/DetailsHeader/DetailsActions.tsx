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
  Copy,
  BanIcon,
  FileOutput,
} from "lucide-react";
import React, { memo, useState } from "react";
import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import { previewPdf } from "@/services/projects/offer";
import { useSession } from "next-auth/react";
import { useSWRConfig } from "swr";
import { isOpen, isLost } from "@/lib/offer";
import { useDelete } from "@/components/projects/offers/useDelete";
import { useCancel } from "@/components/projects/offers/useCancel";
import { useCopy } from "@/components/projects/offers/useCopy";
import { useRevision } from "@/components/projects/offers/useRevision";
import { useCreateOrderConfirmation } from "@/components/projects/offers/useCreateOrderConfirmation";
import { useCreateDeliveryNote } from "@/components/projects/offers/useCreateDeliveryNote";
import { useCreateInvoice } from "@/components/projects/offers/useCreateInvoice";
import { CreateOrderConfirmationButton } from "@/components/projects/buttons/CreateOrderConfirmationButton";
import { CreateDeliveryNoteButton } from "@/components/projects/buttons/CreateDeliveryNoteButton";
import { CreateInvoiceButton } from "@/components/projects/buttons/CreateInvoiceButton";

const ChangeStatusModal = dynamic(
  () => import("../../modals/ChangeStatusModal")
);
const ActivityLogSheetModal = dynamic(
  () => import("../../modals/ActivityLogSheetModal")
);

type DetailsActionsParams = {
  _offer_id: string | undefined;
  data: any;
};

function DetailsActions({ _offer_id, data }: DetailsActionsParams) {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { data: session }: any = useSession();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const { mutateDelete, Dialog: DeleteDialog } = useDelete({
    onDelete: () => {
      toast({
        title: "Offer has been deleted successfully.",
        variant: "success",
        duration: 2000,
      });
      mutate([`/api/projects/offers?`, session?.user?.access_token], undefined);
      setTimeout(() => {
        router.push("/projects/offers");
      }, 300);
    },
  });
  const { mutateCancel, Dialog: CancelDialog } = useCancel({
    onCancel: () => {
      toast({
        title: "Offer has been cancelled successfully.",
        variant: "success",
        duration: 2000,
      });
      mutate(
        [
          `/api/projects/offers/details/${_offer_id}`,
          session?.user?.access_token,
        ],
        undefined
      );
    },
  });
  const { mutateCopy, Dialog: CopyDialog } = useCopy({
    onCopy: (item: string) => {
      router.push(`/projects/offers/${item}`);
    },
  });
  const { mutateRevision, Dialog: RevisionDialog } = useRevision({
    onRevision: (item: string) => {
      router.push(`/projects/offers/${item}`);
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
  const { mutateCreate: mutateCreateDeliveryNote, Dialog: DeliveryNoteDialog } =
    useCreateDeliveryNote({
      onSuccess: (item: string) => {
        router.push(`/projects/delivery-note/${item}`);
      },
    });
  const { mutateCreate: mutateCreateInvoice, Dialog: InvoiceDialog } =
    useCreateInvoice({
      onSuccess: (item: string) => {
        router.push(`/projects/invoices/${item}`);
      },
    });

  const onPreviewPdf = async (_offer_id: any) => {
    const res = await previewPdf(_offer_id, session?.user?.access_token);
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectURL;
    a.target = "_blank";
    a.click();
  };

  const onDownloadPdf = async (_offer_id: any) => {
    const res = await previewPdf(_offer_id, session?.user?.access_token);
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
      <CancelDialog />
      <CopyDialog />
      <RevisionDialog />
      <OrderConfirmationDialog />
      <DeliveryNoteDialog />
      <InvoiceDialog />

      <ChangeStatusModal
        onOpenChange={(open: any) => setStatusModalOpen(open)}
        open={statusModalOpen}
      />

      <ActivityLogSheetModal
        _offer_id={_offer_id}
        open={activityOpen}
        onOpenChange={(open: any) => setActivityOpen(open)}
      />

      <div className="flex items-center gap-1">
        <DetailAction onClick={() => onPreviewPdf(_offer_id)}>
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
            onClick={() => mutateCopy(_offer_id)}
            className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
          >
            <Copy className="w-[18px] h-[18px] text-teal-500" />
            <span className="text-sm font-medium">Copy</span>
          </ItemMenu>
          {data && isOpen(data) ? (
            <>
              <ItemMenu
                onClick={() => mutateCancel(_offer_id)}
                className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
              >
                <BanIcon className="w-[18px] h-[18px] text-red-500" />
                <span className="text-sm font-medium">Lost</span>
              </ItemMenu>
              <ItemMenu
                onClick={() => mutateRevision(_offer_id)}
                className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
              >
                <FileOutput className="w-[18px] h-[18px] text-cyan-500" />
                <span className="text-sm font-medium">Revision</span>
              </ItemMenu>
              <ItemMenu
                onClick={() => mutateDelete(_offer_id)}
                className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
              >
                <Trash2 className="w-[18px] h-[18px] text-red-500" />
                <span className="text-sm font-medium">Delete</span>
              </ItemMenu>
            </>
          ) : null}
          {data && isLost(data) ? null : (
            <>
              <Separator className="my-2" />
              <CreateOrderConfirmationButton
                _order_confirmation_id={data?.offer_has_order_confirmation}
                onCreate={() => mutateCreateOrderConfirmation(_offer_id)}
              />
              <CreateDeliveryNoteButton
                _delivery_note_id={data?.offer_has_delivery_note}
                onCreate={() => mutateCreateDeliveryNote(_offer_id)}
              />
              <CreateInvoiceButton
                _invoice_id={data?.offer_has_invoice}
                invoice_number={data?.offer_original_number}
                onCreate={() => mutateCreateInvoice(_offer_id)}
              />
            </>
          )}
          <Separator className="my-2" />
          <ItemMenu className="gap-3" onClick={() => onDownloadPdf(_offer_id)}>
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
