import AvatarProfile from "@/components/AvatarProfile";
import { ItemMenu } from "@/components/items";
import MoreOption from "@/components/MoreOption";
import {
  ArrowRight,
  Pencil,
  History,
  Trash2,
  FileSearch,
  FileText,
  BanIcon,
  Copy,
  FileOutput,
} from "lucide-react";
import Pagination from "@/components/pagination";
import { StatusChip } from "@/components/projects/offers/StatusChip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addressFormat } from "@/lib/shipping";
import { cn } from "@/lib/utils";
import { getOfferStatus, isOpen, isLost } from "@/lib/offer";
import { baseUrl, fetchApi } from "@/utils/api.config";
import Link from "next/link";
import { useState, useEffect } from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { toast } from "@/components/ui/use-toast";
import { useDelete } from "@/components/projects/offers/useDelete";
import { useCancel } from "@/components/projects/offers/useCancel";
import { useCopy } from "@/components/projects/offers/useCopy";
import { useRevision } from "@/components/projects/offers/useRevision";
import { useCreateOrderConfirmation } from "@/components/projects/offers/useCreateOrderConfirmation";
import { useCreateDeliveryNote } from "@/components/projects/offers/useCreateDeliveryNote";
import { useCreateInvoice } from "@/components/projects/offers/useCreateInvoice";
import { previewPdf } from "@/services/projects/offer";
import { CreateOrderConfirmationButton } from "@/components/projects/buttons/CreateOrderConfirmationButton";
import { CreateDeliveryNoteButton } from "@/components/projects/buttons/CreateDeliveryNoteButton";
import { CreateInvoiceButton } from "@/components/projects/buttons/CreateInvoiceButton";
import SearchInput from "@/components/app/search-input";
import { useRouter } from "next/router";

const ActivityLogSheetModal = dynamic(
  () => import("@/components/projects/offers/modals/ActivityLogSheetModal")
);

export default function ListView({
  access_token,
  _project_id,
  onProject,
}: {
  access_token: any;
  _project_id?: any;
  onProject?: boolean;
}) {
  const router = useRouter();
  const [selectedOffer, setSelectedOffer] = useState<string | undefined>();
  const [activityOpen, setActivityOpen] = useState(false);
  const [list, setList] = useState<any>(null);
  const [search, setSearch] = useState(router.query.search || "");

  const payload: any = {};
  
  if (_project_id) payload["_project_id"] = _project_id;

  payload["page"] = router.query.page || 1;

  if (router.query.search) payload["search"] = router.query.search;
  if (onProject) payload["search"] = search;

  const queryString = new URLSearchParams(payload).toString();

  const { data, isLoading, mutate } = useSWR(
    [`/api/projects/offers?${queryString}`, access_token],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  const { mutateDelete, Dialog: DeleteDialog } = useDelete({
    onDelete: (item: string) => {
      toast({
        title: "Offer has been deleted successfully.",
        variant: "success",
        duration: 2000,
      });
      const offers =
        list?.offers?.filter((offer: any) => offer._offer_id != item) || [];
      setList({ ...list, offers });
    },
  });
  const { mutateCancel, Dialog: CancelDialog } = useCancel({
    onCancel: (item: string) => {
      toast({
        title: "Offer has been cancelled successfully.",
        variant: "success",
        duration: 2000,
      });
      const offers = list?.offers;
      let offer = offers?.find((offer: any) => offer._offer_id === item);

      if (offer) {
        offer.offer_status = "cancelled";
      }

      setList({ ...list, offers });
    },
  });

  const { mutateCopy, Dialog: CopyDialog } = useCopy({
    onCopy: (item: string) => {
      mutate();
      router.push(`/projects/offers/${item}`);
    },
  });

  const { mutateRevision, Dialog: RevisionDialog } = useRevision({
    onRevision: (item: string) => {
      mutate();
      router.push(`/projects/offers/${item}`);
    },
  });

  const {
    mutateCreate: mutateCreateOrderConfirmation,
    Dialog: OrderConfirmationDialog,
  } = useCreateOrderConfirmation({
    onSuccess: (item: string) => {
      mutate();
      router.push(`/projects/order-confirmation/${item}`);
    },
  });

  const { mutateCreate: mutateCreateDeliveryNote, Dialog: DeliveryNoteDialog } =
    useCreateDeliveryNote({
      onSuccess: (item: string) => {
        mutate();
        router.push(`/projects/delivery-note/${item}`);
      },
    });

  const { mutateCreate: mutateCreateInvoice, Dialog: InvoiceDialog } =
    useCreateInvoice({
      onSuccess: (item: string) => {
        mutate();
        router.push(`/projects/invoices/${item}`);
      },
    });
    
  const onPaginate = (page: string) => {
    router.query.page = page;
    router.push(router);
  };

  const onSearch = (value: any) => {
    if (!onProject) {
      router.push({
        pathname: router.pathname,
        query: {
          search: value,
        },
      });
    }
    
    setSearch(value);
  };

  const handleClickHistory = (_offer_id: string | undefined) => {
    setSelectedOffer(_offer_id);
    setActivityOpen(true);
  };

  useEffect(() => {
    setList(data);
  }, [data]);

  const onPreviewPdf = async (offer: any) => {
    const res = await previewPdf(offer?._offer_id, access_token);
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectURL;
    a.target = "_blank";
    a.click();
  };

  const onDownloadPdf = async (offer: any) => {
    const res = await previewPdf(offer?._offer_id, access_token);
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);
    let filename = res.headers.get("Title");
    const a = document.createElement("a");
    a.href = objectURL;
    a.download = (filename as string) + ".pdf";
    a.click();
  };

  return (
    <>
      <DeleteDialog />
      <CancelDialog />
      <CopyDialog />
      <RevisionDialog />
      <OrderConfirmationDialog />
      <DeliveryNoteDialog />
      <InvoiceDialog />
      <ActivityLogSheetModal
        _offer_id={selectedOffer}
        open={activityOpen}
        onOpenChange={(open: any) => setActivityOpen(open)}
      />
      <div className="bg-white w-full rounded-xl shadow-sm">
        <div className="flex justify-between items-center py-2 px-3">
          <p className="text-lg flex font-medium">Offer</p>
          <div className="flex items-center gap-2">
            <Link href="/projects/offers/create">
              <Button className="rounded-xl">New Offer</Button>
            </Link>
            <SearchInput
              onChange={(e) => onSearch(e.target.value)}
              value={search}
              delay={1000}
            />
          </div>
        </div>

        <table className="w-full">
          <thead className="sticky z-10 top-[var(--header-height)]">
            <tr>
              <TH className="ps-4">Offer No.</TH>
              <TH>Client</TH>
              <TH>Description</TH>
              <TH>Currency</TH>
              <TH>Amount</TH>
              <TH className="w-[200px]">Date</TH>
              <TH>Added By</TH>
              <TH>Status</TH>
              <TH className="text-right pe-4">Actions</TH>
            </tr>
          </thead>
          <tbody>
            {isLoading &&
              [0, 0, 0, 0, 0, 0, 0].map((item: any, key: number) => (
                <tr key={key}>
                  <td className="py-3 ps-4 pe-2 align-top">
                    <Skeleton className="w-[100px] h-[15px]" />
                  </td>
                  <td className="py-3 px-2 align-top">
                    <div className="flex flex-col gap-4">
                      <Skeleton className="w-[300px] h-[15px]" />
                      <Skeleton className="w-[200px] h-[15px]" />
                    </div>
                  </td>
                  <td className="py-3 px-2 align-top">
                    <div className="flex flex-col gap-4">
                      <Skeleton className="w-[300px] h-[15px]" />
                      <Skeleton className="w-[200px] h-[15px]" />
                    </div>
                  </td>
                  <td className="py-3 px-2 align-top">
                    <Skeleton className="w-12 h-12 rounded-full" />
                  </td>
                  <td className="py-3 px-2 align-top">
                    <Skeleton className="w-[100px] h-[15px]" />
                  </td>
                  <td className="py-3 px-2 align-top">
                    <Skeleton className="w-[100px] h-[15px]" />
                  </td>
                  <td className="py-3 px-2 align-top" colSpan={2}>
                    <Skeleton className="w-[100px] h-[15px]" />
                  </td>
                </tr>
              ))}
            {list?.offers?.map((row: any, key: number) => (
              <tr key={key} className="group">
                <TD className="ps-4 align-top">
                  <Link href={`${router.pathname}/${row._offer_id}`}>
                    <span className="text-blue-600 font-medium">
                      {row.offer_number}
                    </span>
                  </Link>
                </TD>
                <TD className="align-top w-[350px]">
                  <div className="flex flex-col">
                    <span className="font-medium text-sm uppercase">
                      {row.client}
                    </span>
                    <span className="text-sm text-stone-500">
                      {addressFormat(
                        row.cms_address_building,
                        row.cms_address_street,
                        row.cms_address_city,
                        row.cms_address_country
                      )}
                    </span>
                  </div>
                </TD>
                <TD className="align-top">
                  <span className="text-sm">{row.offer_description}</span>
                </TD>
                <TD className="align-top">
                  <span className="text-sm">{row.currency}</span>
                </TD>
                <TD className="align-top">
                  <span className="text-sm">{row.total_amount}</span>
                </TD>
                <TD className="align-top">
                  <span className="text-sm">
                    {row?.offer_document_date || row?.offer_date || "--"}
                  </span>
                </TD>
                <TD className="align-top">
                  <TooltipProvider delayDuration={400}>
                    <Tooltip>
                      <TooltipTrigger>
                        <AvatarProfile
                          firstname={row.user_firstname}
                          lastname={row.user_lastname}
                          photo={baseUrl + "/users/thumbnail/" + row.user_photo}
                          avatarClassName="w-10 h-10"
                          avatarColor={row.avatar_color}
                          avatarFallbackClassName="font-medium text-white text-xs"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {(row.user_firstname || "N") +
                            " " +
                            (row.user_lastname || "A")}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TD>
                <TD className="align-top">
                  <StatusChip status={getOfferStatus(row)} />
                </TD>
                <TD className="align-top text-right pe-4">
                  <MoreOption>
                    <Link
                      href={`/projects/offers/${row._offer_id}`}
                      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                    >
                      <ArrowRight className="w-[18px] h-[18px] text-violet-500" />
                      <span className="text-sm font-medium">View</span>
                    </Link>
                    {isOpen(row) ? (
                      <>
                        <Link
                          href={`/projects/offers/${row._offer_id}/edit`}
                          className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                        >
                          <Pencil className="w-[18px] h-[18px] text-blue-500" />
                          <span className="text-sm font-medium">Update</span>
                        </Link>
                        <div
                          onClick={() => mutateCancel(row._offer_id)}
                          className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                        >
                          <BanIcon className="w-[18px] h-[18px] text-red-500" />
                          <span className="text-sm font-medium">Lost</span>
                        </div>
                        <div
                          onClick={() => mutateDelete(row._offer_id)}
                          className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                        >
                          <Trash2 className="w-[18px] h-[18px] text-red-500" />
                          <span className="text-sm font-medium">Delete</span>
                        </div>
                        <div
                          onClick={() => mutateRevision(row._offer_id)}
                          className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                        >
                          <FileOutput className="w-[18px] h-[18px] text-cyan-500" />
                          <span className="text-sm font-medium">Revision</span>
                        </div>
                      </>
                    ) : null}
                    <div
                      onClick={() => mutateCopy(row._offer_id)}
                      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                    >
                      <Copy className="w-[18px] h-[18px] text-teal-500" />
                      <span className="text-sm font-medium">Copy</span>
                    </div>
                    {isLost(row) ? null : (
                      <>
                        <Separator className="my-2" />
                        <CreateOrderConfirmationButton
                          _order_confirmation_id={
                            row.offer_has_order_confirmation
                          }
                          onCreate={() =>
                            mutateCreateOrderConfirmation(row._offer_id)
                          }
                        />
                        <CreateDeliveryNoteButton
                          _delivery_note_id={row.offer_has_delivery_note}
                          onCreate={() =>
                            mutateCreateDeliveryNote(row._offer_id)
                          }
                        />
                        <CreateInvoiceButton
                          _invoice_id={row.offer_has_invoice}
                          invoice_number={row.offer_original_number}
                          onCreate={() => mutateCreateInvoice(row._offer_id)}
                        />
                      </>
                    )}
                    <Separator className="my-2" />
                    <div
                      onClick={() => handleClickHistory(row._offer_id)}
                      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                    >
                      <History className="w-[18px] h-[18px] text-blue-500" />
                      <span className="text-sm font-medium">History</span>
                    </div>
                    {isLost(row) ? null : (
                      <>
                        <Separator className="my-2" />
                        <ItemMenu
                          className="gap-3"
                          onClick={() => onPreviewPdf(row)}
                        >
                          <FileSearch className="w-[18px] h-[18px] text-purple-500" />
                          <span className="font-medium">Preview</span>
                        </ItemMenu>
                        <ItemMenu
                          className="gap-3"
                          onClick={() => onDownloadPdf(row)}
                        >
                          <FileText className="w-[18px] h-[18px] text-red-500" />
                          <span className="font-medium">Save as Pdf</span>
                        </ItemMenu>
                      </>
                    )}
                  </MoreOption>
                </TD>
              </tr>
            ))}
            {Array.isArray(data?.offers) && data.offers.length === 0 && (
              <tr>
                <td
                  colSpan={9}
                  className="py-3 text-center font-medium text-lg opacity-70"
                >
                  No Records Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {list && list.pager && (
          <div className="mt-auto border-t border-t-stone-100">
            <Pagination
              pager={list.pager}
              onPaginate={(page: any) => onPaginate(page)}
              currPage={payload["page"]}
            />
          </div>
        )}
      </div>
    </>
  );
}

export const TH = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <td
    className={cn(
      "py-3 px-2 text-sm bg-stone-200 text-stone-600 font-medium",
      className
    )}
  >
    {children}
  </td>
);
export const TD = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <td
    className={cn(
      "py-3 px-2 border-b border-b-stone-100 group-last:border-0",
      className
    )}
  >
    {children}
  </td>
);
