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
} from "lucide-react";
import React, { memo, useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import { previewPdf } from "@/services/projects/invoice";
import { useSession } from "next-auth/react";
import { useDelete } from "@/components/projects/invoices/useDelete";
import { useCopy } from "@/components/projects/invoices/useCopy";
import { useCreateOffer } from "@/components/projects/invoices/useCreateOffer";
import { useCreateOrderConfirmation } from "@/components/projects/invoices/useCreateOrderConfirmation";
import { useCreateCreditNote } from "@/components/projects/invoices/useCreateCreditNote";
import { useMarkAsPaid } from "@/components/projects/invoices/useMarkAsPaid";
import { useMarkAsUnpaid } from "@/components/projects/invoices/useMarkAsUnpaid";
import { useBook } from "@/components/projects/invoices/useBook";
import { CreateMarkAsPaidButton } from "../../buttons/CreateMarkAsPaidButton";
import { CreateBookButton } from "../../buttons/CreateBookButton";
import { CreateOfferButton } from "@/components/projects/buttons/CreateOfferButton";
import { CreateOrderConfirmationButton } from "@/components/projects/buttons/CreateOrderConfirmationButton";
import { CreateCreditNoteButton } from "@/components/projects/buttons/CreateCreditNoteButton";
import { canBook, isOpen } from "@/lib/invoice";
import { ExportAbacusButton } from "@/components/projects/buttons/ExportAbacusButton";
import { ExportPaymentButton } from "@/components/projects/buttons/ExportPaymentButton";
import { ExportDiscountButton } from "@/components/projects/buttons/ExportDiscountButton";
import AbacusExportModal from "@/components/projects/invoices/modals/AbacusExportModal";
import ViewAbacusExportModal from "@/components/projects/invoices/modals/ViewAbacusExportModal";
import ExportPaymentModal from "@/components/projects/invoices/modals/ExportPaymentModal";
import ViewExportPaymentModal from "@/components/projects/invoices/modals/ViewExportPaymentModal";
import ExportDiscountModal from "@/components/projects/invoices/modals/ExportDiscountModal";
import ViewExportDiscountModal from "@/components/projects/invoices/modals/ViewExportDiscountModal";
import { authHeaders, baseUrl } from "@/utils/api.config";

const ChangeStatusModal = dynamic(
  () => import("../../modals/ChangeStatusModal")
);
const ActivityLogSheetModal = dynamic(
  () => import("../../modals/ActivityLogSheetModal")
);

type DetailsActionsParams = {
  _invoice_id: string | undefined;
  data: any;
};

function DetailsActions({ _invoice_id, data }: DetailsActionsParams) {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { data: session }: any = useSession();
  const [isConnected, setIsConnected] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [exportAbacus, setExportAbacus] = useState<boolean>(false);
  const [exportAbacusInvoice, setExportAbacusInvoice] = useState<any>(null);
  const [viewExportedAbacus, setViewExportedAbacus] = useState<boolean>(false);
  const [exportPayment, setExportPayment] = useState<boolean>(false);
  const [exportDiscount, setExportDiscount] = useState<boolean>(false);
  const [viewExportedPayment, setViewExportedPayment] =
    useState<boolean>(false);
  const [viewExportedDiscount, setViewExportedDiscount] =
    useState<boolean>(false);
  const { mutateDelete, Dialog: DeleteDialog } = useDelete({
    onDelete: () => {
      toast({
        title: "Invoice has been deleted successfully.",
        variant: "success",
        duration: 2000,
      });
      mutate(
        [`/api/projects/invoices?`, session?.user?.access_token],
        undefined
      );
      setTimeout(() => {
        router.push("/projects/invoices");
      }, 300);
    },
  });
  const { mutateCopy, Dialog: CopyDialog } = useCopy({
    onCopy: (item: string) => {
      router.push(`/projects/invoices/${item}`);
    },
  });
  const { mutateChange: mutatePaid, Dialog: MarkAsPaidDialog } = useMarkAsPaid({
    onSuccess: (item: string, paidDate: string) => {
      data.invoice_status = "paid";
      data.invoice_paid_date = paidDate;
      mutate([
        `/api/projects/invoices/details/${_invoice_id}`,
        session?.user?.access_token,
      ]);
    },
  });
  const { mutateChange: mutateUnpaid, Dialog: MarkAsUnpaidDialog } =
    useMarkAsUnpaid({
      onSuccess: (item: string) => {
        data.invoice_status = "active";
        mutate([
          `/api/projects/invoices/details/${_invoice_id}`,
          session?.user?.access_token,
        ]);
      },
    });
  const { mutateChange: mutateBook, Dialog: BookDialog } = useBook({
    onSuccess: (item: string, isBooked: boolean, time: string) => {
      data.invoice_is_booked = isBooked ? 1 : 0;
      data.invoice_is_booked_date = time;
      mutate([
        `/api/projects/invoices/details/${_invoice_id}`,
        session?.user?.access_token,
      ]);
    },
  });
  const { mutateCreate: mutateCreateOffer, Dialog: OfferDialog } =
    useCreateOffer({
      onSuccess: (item: string) => {
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
  const { mutateCreate: mutateCreateCreditNote, Dialog: CreateNoteDialog } =
    useCreateCreditNote({
      onSuccess: (item: string) => {
        router.push(`/projects/credit-note/${item}`);
      },
    });

  const onPreviewPdf = async (_invoice_id: any) => {
    const res = await previewPdf(_invoice_id, session?.user?.access_token);
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectURL;
    a.target = "_blank";
    a.click();
  };

  const onDownloadPdf = async (_invoice_id: any) => {
    const res = await previewPdf(_invoice_id, session?.user?.access_token);
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);
    let filename = res.headers.get("Title");
    const a = document.createElement("a");
    a.href = objectURL;
    a.download = (filename as string) + ".pdf";
    a.click();
  };

  const handleAbacusExport = (invoice: any) => {
    setExportAbacus(true);
    setExportAbacusInvoice(invoice);
  };

  const handleViewAbacusExported = (invoice: any) => {
    setViewExportedAbacus(true);
    setExportAbacusInvoice(invoice);
  };

  const handleExportPayment = (invoice: any) => {
    setExportPayment(true);
    setExportAbacusInvoice(invoice);
  };

  const handleViewExportedPayment = (invoice: any) => {
    setViewExportedPayment(true);
    setExportAbacusInvoice(invoice);
  };

  const handleExportDiscount = (invoice: any) => {
    setExportDiscount(true);
    setExportAbacusInvoice(invoice);
  };

  const handleViewExportedDiscount = (invoice: any) => {
    setViewExportedDiscount(true);
    setExportAbacusInvoice(invoice);
  };

  useEffect(() => {
    const checkAbacusConnection = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/projects/invoices/settings/check-connection`,
          {
            headers: authHeaders(session?.user?.access_token),
          }
        );

        const data = await res.json();

        if (data?.is_abacus_connected == 1) {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      } catch (err) {
        // Handle error if needed
      }
    };

    checkAbacusConnection();
  }, [session?.user?.access_token]);

  return (
    <React.Fragment>
      <DeleteDialog />
      <CopyDialog />
      <MarkAsPaidDialog />
      <MarkAsUnpaidDialog />
      <BookDialog />
      <OfferDialog />
      <OrderConfirmationDialog />
      <CreateNoteDialog />

      <ChangeStatusModal
        onOpenChange={(open: any) => setStatusModalOpen(open)}
        open={statusModalOpen}
      />
      <AbacusExportModal
        open={exportAbacus}
        onOpenChange={setExportAbacus}
        invoice={exportAbacusInvoice}
        onSubmit={() => {
          mutate([
            `/api/projects/invoices/details/${_invoice_id}`,
            session?.user?.access_token,
          ]);
          mutate([
            `/api/projects/invoices/${_invoice_id}/abacus`,
            session?.user?.access_token,
          ]);
        }}
      />
      <ViewAbacusExportModal
        open={viewExportedAbacus}
        onOpenChange={setViewExportedAbacus}
        _invoice_id={_invoice_id}
      />
      <ExportPaymentModal
        open={exportPayment}
        onOpenChange={setExportPayment}
        invoice={exportAbacusInvoice}
        onSubmit={() => {
          mutate([
            `/api/projects/invoices/details/${_invoice_id}`,
            session?.user?.access_token,
          ]);
          mutate([
            `/api/projects/invoices/${_invoice_id}/abacus`,
            session?.user?.access_token,
          ]);
        }}
      />
      <ViewExportPaymentModal
        open={viewExportedPayment}
        onOpenChange={setViewExportedPayment}
        _invoice_id={exportAbacusInvoice?._invoice_id}
      />
      <ExportDiscountModal
        open={exportDiscount}
        onOpenChange={setExportDiscount}
        invoice={exportAbacusInvoice}
        onSubmit={() => {
          mutate([
            `/api/projects/invoices/details/${_invoice_id}`,
            session?.user?.access_token,
          ]);
          mutate([
            `/api/projects/invoices/${_invoice_id}/abacus`,
            session?.user?.access_token,
          ]);
        }}
      />
      <ViewExportDiscountModal
        open={viewExportedDiscount}
        onOpenChange={setViewExportedDiscount}
        _invoice_id={exportAbacusInvoice?._invoice_id}
      />

      <ActivityLogSheetModal
        _invoice_id={_invoice_id}
        open={activityOpen}
        onOpenChange={(open: any) => setActivityOpen(open)}
      />

      <div className="flex items-center gap-1">
        <DetailAction onClick={() => onPreviewPdf(_invoice_id)}>
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
          {data && isOpen(data) ? (
            <DetailActionDropdownItem
              label="Delete"
              onClick={() => mutateDelete(_invoice_id)}
              icon={<Trash2 className="w-[18px] h-[18px] text-purple-500" />}
            />
          ) : null}
          <ItemMenu
            onClick={() => mutateCopy(_invoice_id)}
            className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
          >
            <Copy className="w-[18px] h-[18px] text-teal-500" />
            <span className="text-sm font-medium">Copy</span>
          </ItemMenu>
          <Separator className="my-2" />
          {isConnected && (
            <ExportAbacusButton
              onView={() => handleViewAbacusExported(data)}
              exported_by={data?.invoice_is_exported_by}
              onExport={() => handleAbacusExport(data)}
            />
          )}
          {data?.invoice_payment_export_status == 1 &&
          data?.invoice_is_exported_by != null ? null : (
            <CreateMarkAsPaidButton
              isPaid={data?.invoice_status}
              onPaid={() => mutatePaid(_invoice_id)}
              onUnpaid={() => mutateUnpaid(_invoice_id)}
            />
          )}
          {isConnected && data?.invoice_is_exported_by != null && (
            <ExportPaymentButton
              invoice={data}
              onView={() => handleViewExportedPayment(data)}
              onExport={() => handleExportPayment(data)}
            />
          )}
          {data && canBook(data) ? (
            <CreateBookButton
              isBooked={data?.invoice_is_booked == 1}
              onBook={() => mutateBook(_invoice_id, true)}
              onUnbook={() => mutateBook(_invoice_id, false)}
            />
          ) : null}
          {isConnected && (
            <ExportDiscountButton
              invoice={data}
              onView={() => handleViewExportedDiscount(data)}
              onExport={() => handleExportDiscount(data)}
            />
          )}
          <Separator className="my-2" />
          <CreateOfferButton
            _offer_id={data?.invoice_has_offer}
            onCreate={() => mutateCreateOffer(_invoice_id)}
          />
          <CreateOrderConfirmationButton
            _order_confirmation_id={data?.invoice_has_order_confirmation}
            onCreate={() => mutateCreateOrderConfirmation(_invoice_id)}
          />
          <CreateCreditNoteButton
            _credit_note_id={data?.invoice_has_credit_note}
            credit_note_number={data?.invoice_original_number}
            onCreate={() => mutateCreateCreditNote(_invoice_id)}
          />
          <Separator className="my-2" />
          <ItemMenu
            className="gap-3"
            onClick={() => onDownloadPdf(_invoice_id)}
          >
            <FileText className="w-[18px] h-[18px] text-red-500" />
            <span className="font-medium">Save as Pdf</span>
          </ItemMenu>
          <Separator className="my-2" />
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
