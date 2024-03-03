import AvatarProfile from "@/components/AvatarProfile";
import { ItemMenu } from "@/components/items";
import MoreOption from "@/components/MoreOption";
import AdminLayout from "@/components/admin-layout";
import {
  ArrowRight,
  Pencil,
  History,
  Trash2,
  FileSearch,
  FileText,
  Copy,
} from "lucide-react";
import Pagination from "@/components/pagination";
import { StatusChip } from "@/components/projects/delivery-note/StatusChip";
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
import { getDeliveryStatus, isClosed } from "@/lib/delivery";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { baseUrl, fetchApi } from "@/utils/api.config";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { useDelete } from "@/components/projects/delivery-note/useDelete";
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
import SearchInput from "@/components/app/search-input";

import { previewPdf } from "@/services/projects/delivery";
import { FileOutput } from "lucide-react";

const ActivityLogSheetModal = dynamic(
  () =>
    import("@/components/projects/delivery-note/modals/ActivityLogSheetModal")
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
  const [search, setSearch] = useState(router.query.search || "");
  const [selectedDeliveryNote, setSelectedDeliveryNote] = useState<
    string | undefined
  >();
  const [activityOpen, setActivityOpen] = useState(false);
  const [list, setList] = useState<any>(null);

  const payload: any = {};
  if (_project_id) payload["_project_id"] = _project_id;

  payload["page"] = router.query.page || 1;

  if (router.query.search) payload["search"] = router.query.search;
  if (onProject) payload["search"] = search;

  const queryString = new URLSearchParams(payload).toString();

  const { data, isLoading, mutate } = useSWR(
    [`/api/projects/deliveries?${queryString}`, access_token],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const { mutateDelete, Dialog: DeleteDialog } = useDelete({
    onDelete: (item: string) => {
      const delivery_note =
        list?.delivery_note?.filter(
          (delivery_note: any) => delivery_note._delivery_note_id != item
        ) || [];
      setList({ ...list, delivery_note });
    },
  });

  const { mutateCopy, Dialog: CopyDialog } = useCopy({
    onCopy: (item: string) => {
      mutate();
      router.push(`/projects/delivery-note/${item}`);
    },
  });

  const { mutateChange, Dialog: ChangeStatusDialog } = useChangeStatus({
    onChange: (item: string) => {
      mutate();
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

  const { mutateCreate: mutateCreateInvoice, Dialog: InvoiceDialog } =
    useCreateInvoice({
      onSuccess: (item: string) => {
        mutate();
        router.push(`/projects/invoices/${item}`);
      },
    });

  const { mutateCreate: mutateCreateOffer, Dialog: OfferDialog } =
    useCreateOffer({
      onSuccess: (item: string) => {
        mutate();
        router.push(`/projects/offers/${item}`);
      },
    });

  const { mutateCreate: mutateCreateShipping, Dialog: ShippingDialog } =
    useCreateShippingList({
      onSuccess: (item: string) => {
        mutate();
        router.push(`/projects/shipping-list/${item}`);
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

  const handleClickHistory = (_delivery_note_id: string | undefined) => {
    setSelectedDeliveryNote(_delivery_note_id);
    setActivityOpen(true);
  };

  useEffect(() => {
    setList(data);
  }, [data]);

  const onPreviewPdf = async (dn: any) => {
    const res = await previewPdf(dn?._delivery_note_id, access_token);
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectURL;
    a.target = "_blank";
    a.click();
  };

  const onDownloadPdf = async (dn: any) => {
    const res = await previewPdf(dn?._delivery_note_id, access_token);
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
      <CopyDialog />
      <ChangeStatusDialog />
      <OrderConfirmationDialog />
      <OfferDialog />
      <InvoiceDialog />
      <ShippingDialog />
      <ActivityLogSheetModal
        _delivery_note_id={selectedDeliveryNote}
        open={activityOpen}
        onOpenChange={(open: any) => setActivityOpen(open)}
      />
      <div className="bg-white w-full rounded-xl shadow">
        <div className="flex justify-between items-center py-2 px-3">
          <p className="text-lg flex font-medium">Delivery Notes</p>
          <div className="flex items-center gap-2">
            <Link href="/projects/delivery-note/create">
              <Button className="rounded-xl">New Delivery Note</Button>
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
              <TH className="ps-4">Delivery No.</TH>
              <TH>Client</TH>
              <TH>Description</TH>
              <TH>Currency</TH>
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
            {list?.delivery_note?.map((row: any, key: number) => (
              <tr key={key} className="group">
                <TD className="ps-4 align-top">
                  <Link href={`${router.pathname}/${row._delivery_note_id}`}>
                    <span className="text-blue-600 font-medium">
                      {row.delivery_note_number}
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
                  <span className="text-sm">
                    {row.delivery_note_description}
                  </span>
                </TD>
                <TD className="align-top">
                  <span className="text-sm">{row.currency}</span>
                </TD>
                <TD className="align-top">
                  <span className="text-sm">
                    {row?.delivery_note_document_date ||
                      row?.delivery_note_date ||
                      "--"}
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
                  <StatusChip status={getDeliveryStatus(row)} />
                </TD>
                <TD className="align-top text-right pe-4">
                  <MoreOption>
                    <Link
                      href={`/projects/delivery-note/${row._delivery_note_id}`}
                      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                    >
                      <ArrowRight className="w-[18px] h-[18px] text-violet-500" />
                      <span className="text-sm font-medium">View</span>
                    </Link>
                    {!isClosed(row) ? (
                      <>
                        <div
                          onClick={() => mutateChange(row._delivery_note_id)}
                          className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                        >
                          <FileOutput className="w-[18px] h-[18px] text-rose-500" />
                          <span className="text-sm font-medium">
                            Change Status
                          </span>
                        </div>
                        <Link
                          href={`/projects/delivery-note/${row._delivery_note_id}/edit`}
                          className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                        >
                          <Pencil className="w-[18px] h-[18px] text-blue-500" />
                          <span className="text-sm font-medium">Update</span>
                        </Link>
                        <div
                          onClick={() => mutateDelete(row._delivery_note_id)}
                          className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                        >
                          <Trash2 className="w-[18px] h-[18px] text-red-500" />
                          <span className="text-sm font-medium">Delete</span>
                        </div>
                      </>
                    ) : null}
                    <div
                      onClick={() => mutateCopy(row._delivery_note_id)}
                      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                    >
                      <Copy className="w-[18px] h-[18px] text-teal-500" />
                      <span className="text-sm font-medium">Copy</span>
                    </div>
                    <Separator className="my-2" />
                    <CreateOfferButton
                      _offer_id={row.delivery_note_has_offer}
                      onCreate={() => mutateCreateOffer(row._delivery_note_id)}
                    />
                    <CreateOrderConfirmationButton
                      _order_confirmation_id={
                        row.delivery_note_has_order_confirmation
                      }
                      onCreate={() =>
                        mutateCreateOrderConfirmation(row._delivery_note_id)
                      }
                    />
                    <CreateInvoiceButton
                      _invoice_id={row.delivery_note_has_invoice}
                      invoice_number={row.delivery_note_original_number}
                      onCreate={() =>
                        mutateCreateInvoice(row._delivery_note_id)
                      }
                    />
                    <CreateShippingListButton
                      _shipping_id={row.delivery_note_has_shipping}
                      onCreate={() =>
                        mutateCreateShipping(row._delivery_note_id)
                      }
                    />
                    <Separator className="my-2" />
                    <div
                      onClick={() => handleClickHistory(row._delivery_note_id)}
                      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                    >
                      <History className="w-[18px] h-[18px] text-blue-500" />
                      <span className="text-sm font-medium">History</span>
                    </div>
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
                  </MoreOption>
                </TD>
              </tr>
            ))}
            {Array.isArray(data?.delivery_note) &&
              data.delivery_note.length === 0 && (
                <tr>
                  <td
                    colSpan={8}
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
