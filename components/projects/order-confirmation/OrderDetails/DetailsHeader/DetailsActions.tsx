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
import { useSWRConfig } from "swr";
import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import { previewPdf } from "@/services/projects/order";
import { useSession } from "next-auth/react";
import { useDelete } from "@/components/projects/order-confirmation/useDelete";
import { useCopy } from "@/components/projects/order-confirmation/useCopy";
import { useChangeStatus } from "@/components/projects/order-confirmation/useChangeStatus";
import { useCreateOffer } from "@/components/projects/order-confirmation/useCreateOffer";
import { useCreateDeliveryNote } from "@/components/projects/order-confirmation/useCreateDeliveryNote";
import { useCreateInvoice } from "@/components/projects/order-confirmation/useCreateInvoice";
import { useCreateProject } from "@/components/projects/order-confirmation/useCreateProject";
import { CreateOfferButton } from "@/components/projects/buttons/CreateOfferButton";
import { CreateDeliveryNoteButton } from "@/components/projects/buttons/CreateDeliveryNoteButton";
import { CreateInvoiceButton } from "@/components/projects/buttons/CreateInvoiceButton";
import { CreateProjectButton } from "@/components/projects/buttons/CreateProjectButton";
import { isCancelled, isOpen } from "@/lib/order";

const ActivityLogSheetModal = dynamic(
  () => import("../../modals/ActivityLogSheetModal")
);

type DetailsActionsParams = {
  _order_confirmation_id: string | undefined;
  data: any;
};

function DetailsActions({
  _order_confirmation_id,
  data,
}: DetailsActionsParams) {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { data: session }: any = useSession();
  const [activityOpen, setActivityOpen] = useState(false);
  const { mutateDelete, Dialog: DeleteDialog } = useDelete({
    onDelete: () => {
      toast({
        title: "Order confirmation has been deleted successfully.",
        variant: "success",
        duration: 2000,
      });
      mutate([`/api/projects/orders?`, session?.user?.access_token], undefined);
      setTimeout(() => {
        router.push("/projects/order-confirmation");
      }, 300);
    },
  });
  const { mutateCopy, Dialog: CopyDialog } = useCopy({
    onCopy: (item: string) => {
      router.push(`/projects/order-confirmation/${item}`);
    },
  });
  const { mutateChange, Dialog: ChangeStatusDialog } = useChangeStatus({
    onChange: (item: string) => {
      mutate(
        [
          `/api/projects/orders/details/${_order_confirmation_id}`,
          session?.user?.access_token,
        ],
        undefined
      );
    },
  });
  const { mutateCreate: mutateCreateOffer, Dialog: OfferDialog } =
    useCreateOffer({
      onSuccess: (item: string) => {
        router.push(`/projects/offers/${item}`);
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
  const { mutateCreate: mutateCreateProject, Dialog: ProjectDialog } =
    useCreateProject({
      onSuccess: (id: string) => {
        router.push(`/projects/add/${id}`);
      },
    });

  const onPreviewPdf = async (_order_confirmation_id: any) => {
    const res = await previewPdf(
      _order_confirmation_id,
      session?.user?.access_token
    );
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectURL;
    a.target = "_blank";
    a.click();
  };

  const onDownloadPdf = async (_order_confirmation_id: any) => {
    const res = await previewPdf(
      _order_confirmation_id,
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
      <ChangeStatusDialog />
      <OfferDialog />
      <DeliveryNoteDialog />
      <InvoiceDialog />
      <ProjectDialog />

      <ActivityLogSheetModal
        _order_confirmation_id={_order_confirmation_id}
        open={activityOpen}
        onOpenChange={(open: any) => setActivityOpen(open)}
      />

      <div className="flex items-center gap-1">
        <DetailAction onClick={() => onPreviewPdf(_order_confirmation_id)}>
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
            onClick={() => mutateCopy(_order_confirmation_id)}
            className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
          >
            <Copy className="w-[18px] h-[18px] text-teal-500" />
            <span className="text-sm font-medium">Copy</span>
          </ItemMenu>
          {data && isOpen(data) ? (
            <>
              <ItemMenu
                onClick={() => mutateChange(_order_confirmation_id)}
                className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
              >
                <FileOutput className="w-[18px] h-[18px] text-rose-500" />
                <span className="text-sm font-medium">Change Status</span>
              </ItemMenu>
              <ItemMenu
                onClick={() => mutateDelete(_order_confirmation_id)}
                className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
              >
                <Trash2 className="w-[18px] h-[18px] text-red-500" />
                <span className="text-sm font-medium">Delete</span>
              </ItemMenu>
            </>
          ) : null}
          {data && isCancelled(data) ? null : (
            <>
              <Separator className="my-2" />
              <CreateOfferButton
                _offer_id={data?.order_confirmation_has_offer}
                onCreate={() => mutateCreateOffer(_order_confirmation_id)}
              />
              <CreateDeliveryNoteButton
                _delivery_note_id={data?.order_confirmation_has_delivery_note}
                onCreate={() =>
                  mutateCreateDeliveryNote(_order_confirmation_id)
                }
              />
              <CreateInvoiceButton
                _invoice_id={data?.order_confirmation_has_invoice}
                invoice_number={data?.order_confirmation_original_number}
                onCreate={() => mutateCreateInvoice(_order_confirmation_id)}
              />
              <CreateProjectButton
                _project_id={data?.order_confirmation_has_project}
                onCreate={() => mutateCreateProject(data.order_confirmation_id)}
              />
            </>
          )}
          <Separator className="my-2" />
          <ItemMenu
            className="gap-3"
            onClick={() => onDownloadPdf(_order_confirmation_id)}
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
