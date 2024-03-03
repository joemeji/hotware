import AvatarProfile from "@/components/AvatarProfile";
import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import {
  ViewIcon,
  Pencil,
  History,
  Trash2,
  FileSearch,
  FileText,
  Copy,
  Search,
} from "lucide-react";
import Pagination from "@/components/pagination";
import { StatusChip } from "@/components/projects/invoices/StatusChip";
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
import {
  BOOKED,
  UNBOOKED,
  getInvoiceStatus,
  isOpen,
  canBook,
} from "@/lib/invoice";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { previewPdf } from "@/services/projects/invoice";
import { useDelete } from "@/components/projects/invoices/useDelete";
import { useCopy } from "@/components/projects/invoices/useCopy";
import { useCreateOffer } from "@/components/projects/invoices/useCreateOffer";
import { useCreateOrderConfirmation } from "@/components/projects/invoices/useCreateOrderConfirmation";
import { useCreateCreditNote } from "@/components/projects/invoices/useCreateCreditNote";
import { useMarkAsPaid } from "@/components/projects/invoices/useMarkAsPaid";
import { useMarkAsUnpaid } from "@/components/projects/invoices/useMarkAsUnpaid";
import { useBook } from "@/components/projects/invoices/useBook";
import { CreateOfferButton } from "@/components/projects/buttons/CreateOfferButton";
import { CreateOrderConfirmationButton } from "@/components/projects/buttons/CreateOrderConfirmationButton";
import { CreateCreditNoteButton } from "@/components/projects/buttons/CreateCreditNoteButton";
import { CreateMarkAsPaidButton } from "@/components/projects/invoices/buttons/CreateMarkAsPaidButton";
import { CreateBookButton } from "@/components/projects/invoices/buttons/CreateBookButton";
import { ExportAbacusButton } from "@/components/projects/buttons/ExportAbacusButton";
import { ExportPaymentButton } from "@/components/projects/buttons/ExportPaymentButton";
import { ExportDiscountButton } from "@/components/projects/buttons/ExportDiscountButton";
import AbacusExportModal from "@/components/projects/invoices/modals/AbacusExportModal";
import ViewAbacusExportModal from "@/components/projects/invoices/modals/ViewAbacusExportModal";
import ExportPaymentModal from "@/components/projects/invoices/modals/ExportPaymentModal";
import ViewExportPaymentModal from "@/components/projects/invoices/modals/ViewExportPaymentModal";
import ExportDiscountModal from "@/components/projects/invoices/modals/ExportDiscountModal";
import ViewExportDiscountModal from "@/components/projects/invoices/modals/ViewExportDiscountModal";
import SearchInput from "@/components/app/search-input";

const ActivityLogSheetModal = dynamic(
  () => import("@/components/projects/invoices/modals/ActivityLogSheetModal")
);

export default function ListView({
  access_token,
  _project_id,
  dashboard,
  onProject,
}: {
  access_token: any;
  _project_id?: any;
  dashboard?: boolean;
  onProject?: boolean;
}) {
  const router = useRouter();
  const [search, setSearch] = useState(router.query.search || "");
  const [selectedInvoice, setSelectedInvoice] = useState<string | undefined>();
  const [activityOpen, setActivityOpen] = useState(false);
  const [list, setList] = useState<any>(null);
  const [exportAbacus, setExportAbacus] = useState<boolean>(false);
  const [exportAbacusInvoice, setExportAbacusInvoice] = useState<any>(null);
  const [viewExportedAbacus, setViewExportedAbacus] = useState<boolean>(false);
  const [exportPayment, setExportPayment] = useState<boolean>(false);
  const [exportDiscount, setExportDiscount] = useState<boolean>(false);
  const [viewExportedPayment, setViewExportedPayment] =
    useState<boolean>(false);
  const [viewExportedDiscount, setViewExportedDiscount] =
    useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [isConnected, setIsConnected] = useState(false);

  const payload: any = {};
  if (_project_id) payload["_project_id"] = _project_id;

  if (dashboard) {
    payload["page"] = page;
  } else {
    payload["page"] = router.query.page || 1;
  }

  if (router.query.search) payload["search"] = router.query.search;
  if (onProject) payload["search"] = search;

  const queryString = new URLSearchParams(payload).toString();

  let uri = "/api/projects/invoices";

  if (dashboard) {
    uri = "/api/projects/invoices/due_invoices";
  }

  const { data, isLoading, mutate } = useSWR(
    [`${uri}?${queryString}`, access_token],
    fetchApi,
    {
      revalidateOnFocus: true,
      revalidateIfStale: false,
    }
  );

  const { mutateDelete, Dialog: DeleteDialog } = useDelete({
    onDelete: (item: string) => {
      const invoice =
        list?.invoice?.filter((invoice: any) => invoice._invoice_id != item) ||
        [];
      setList({ ...list, invoice });
    },
  });

  const { mutateCopy, Dialog: CopyDialog } = useCopy({
    onCopy: (item: string) => {
      mutate();
      router.push(`/projects/invoices/${item}`);
    },
  });

  const { mutateChange: mutatePaid, Dialog: MarkAsPaidDialog } = useMarkAsPaid({
    onSuccess: (item: string, paidDate: string) => {
      let invoices = list?.invoice as any[];
      let invoiceIndex = invoices?.findIndex(
        (inv: any) => inv._invoice_id === item
      );
      if (invoiceIndex >= 0) {
        invoices[invoiceIndex].invoice_status = "paid";
        invoices[invoiceIndex].invoice_paid_date = paidDate;
      }
      setList({ ...list, invoice: invoices });
    },
  });

  const { mutateChange: mutateUnpaid, Dialog: MarkAsUnpaidDialog } =
    useMarkAsUnpaid({
      onSuccess: (item: string) => {
        let invoices = list?.invoice as any[];
        let invoiceIndex = invoices?.findIndex(
          (inv: any) => inv._invoice_id === item
        );
        if (invoiceIndex >= 0) invoices[invoiceIndex].invoice_status = "active";
        setList({ ...list, invoice: invoices });
      },
    });

  const { mutateChange: mutateBook, Dialog: BookDialog } = useBook({
    onSuccess: (item: string, isBooked: boolean, time: string) => {
      let invoices = list?.invoice as any[];
      let invoiceIndex = invoices?.findIndex(
        (inv: any) => inv._invoice_id === item
      );
      if (invoiceIndex >= 0) {
        invoices[invoiceIndex].invoice_is_booked = isBooked ? 1 : 0;
        invoices[invoiceIndex].invoice_is_booked_date = time;
      }
      setList({ ...list, invoice: invoices });
    },
  });

  const { mutateCreate: mutateCreateOffer, Dialog: OfferDialog } =
    useCreateOffer({
      onSuccess: (item: string) => {
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

  const { mutateCreate: mutateCreateCreditNote, Dialog: CreateNoteDialog } =
    useCreateCreditNote({
      onSuccess: (item: string) => {
        mutate();
        router.push(`/projects/credit-note/${item}`);
      },
    });

  const onPaginate = (_page: any) => {
    if (dashboard) setPage(_page);
    else {
      router.query.page = _page;
      router.push(router);
    }
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

  const handleClickHistory = (_invoice_id: string | undefined) => {
    setSelectedInvoice(_invoice_id);
    setActivityOpen(true);
  };

  useEffect(() => {
    setList(data);
  }, [data]);

  useEffect(() => {
    const checkAbacusConnection = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/projects/invoices/settings/check-connection`,
          {
            headers: authHeaders(access_token),
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
  }, [access_token]);

  const onPreviewPdf = async (invoice: any) => {
    const res = await previewPdf(invoice?._invoice_id, access_token);
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectURL;
    a.target = "_blank";
    a.click();
  };

  const onDownloadPdf = async (invoice: any) => {
    const res = await previewPdf(invoice?._invoice_id, access_token);
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
    setExportAbacusInvoice(invoice);
    setViewExportedDiscount(true);
  };

  const getStatusColor = (row: any) => {
    return row.invoice_status == "paid"
      ? row.invoice_payment_export_status == 1 &&
        row.invoice_is_exported_by != null
        ? "bg-blue-200"
        : "bg-green-200"
      : row.invoice_status == ""
      ? "bg-red-200"
      : row.invoice_has_credit_note != 0
      ? "bg-orange-200"
      : "";
  };

  return (
    <>
      <DeleteDialog />
      <CopyDialog />
      <MarkAsPaidDialog />
      <MarkAsUnpaidDialog />
      <BookDialog />
      <OfferDialog />
      <OrderConfirmationDialog />
      <CreateNoteDialog />
      <AbacusExportModal
        open={exportAbacus}
        onOpenChange={setExportAbacus}
        invoice={exportAbacusInvoice}
        onSubmit={() => {
          mutate();
        }}
      />
      <ViewAbacusExportModal
        open={viewExportedAbacus}
        onOpenChange={setViewExportedAbacus}
        _invoice_id={exportAbacusInvoice?._invoice_id}
      />
      <ExportPaymentModal
        open={exportPayment}
        onOpenChange={setExportPayment}
        invoice={exportAbacusInvoice}
        onSubmit={() => {
          mutate();
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
          mutate();
        }}
      />
      <ViewExportDiscountModal
        open={viewExportedDiscount}
        onOpenChange={setViewExportedDiscount}
        _invoice_id={exportAbacusInvoice?._invoice_id}
      />
      <ActivityLogSheetModal
        _invoice_id={selectedInvoice}
        open={activityOpen}
        onOpenChange={(open: any) => setActivityOpen(open)}
      />
      <div className="bg-white w-full rounded-xl shadow">
        <div className="flex justify-between items-center py-2 px-3">
          <p className="text-lg flex font-medium">
            {dashboard ? "Due Invoices" : "Invoices"}
          </p>
          <div className="flex items-center gap-2">
            {!dashboard && (
              <Link href="/projects/invoices/create">
                <Button className="rounded-xl">New Invoice</Button>
              </Link>
            )}
            <SearchInput
              onChange={(e) => onSearch(e.target.value)}
              value={search}
              delay={1000}
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            {!dashboard ? (
              <tr>
                <TH className="ps-4 align-top">Invoice No.</TH>
                <TH className="align-top">Client</TH>
                <TH className="align-top">Description</TH>
                <TH className="align-top">Currency</TH>
                <TH className="align-top">Amount (Total)</TH>
                <TH className="align-top">Amount (Open)</TH>
                <TH className="align-top">Invoice Date</TH>
                <TH className="align-top">Due Date</TH>
                <TH className="align-top">Added By</TH>
                <TH className="align-top">Booked</TH>
                <TH className="align-top">Status</TH>
                <TH className="text-right pe-4"></TH>
              </tr>
            ) : (
              <tr>
                <TH className="ps-4 align-top">Invoice No.</TH>
                <TH className="align-top">Client</TH>
                <TH className="align-top">Amount (Total)</TH>
                <TH className="align-top">Added By</TH>
                <TH className="align-top">Booked</TH>
                <TH className="text-right pe-4"></TH>
              </tr>
            )}
          </thead>
          <tbody>
            {/* {isLoading &&
              Array.from({ length: 5 }).map((item: any, key: number) => (
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
                </tr>
              ))} */}

            {isLoading && (
              <tr>
                <td colSpan={dashboard ? 6 : 12}>
                  <div className="flex flex-col gap-2 p-3">
                    <Skeleton className="w-[300px] h-[15px]" />
                    <Skeleton className="w-[160px] h-[15px]" />
                  </div>
                </td>
              </tr>
            )}
            {list?.invoice?.map((row: any, key: number) => {
              const invoiceNumber = (
                <Link href={`${router.pathname}/${row._invoice_id}`}>
                  <span className="text-blue-600 font-medium">
                    {row.invoice_number}
                  </span>
                </Link>
              );

              const client = (
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
              );

              const description = (
                <span className="text-sm">{row.invoice_description}</span>
              );
              const currency = <span className="text-sm">{row.currency}</span>;
              const totalAmount = (
                <span className="text-sm">
                  {row.invoice_total.toLocaleString()}
                </span>
              );

              const openAmount = (
                <span className="text-sm">
                  {(
                    parseFloat(row.invoice_total) -
                    parseFloat(row.invoice_open_amount)
                  ).toLocaleString()}
                </span>
              );

              const invoiceDate = (
                <span className="text-sm">
                  {row?.invoice_document_date || row?.invoice_date || "--"}
                </span>
              );

              const dueDate = (
                <span className="text-sm">
                  {row.invoice_due_date ? row.invoice_due_date : ""}
                </span>
              );

              const addedBy = (
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
              );

              const booked = (
                <span className="text-sm">
                  <StatusChip
                    status={row.invoice_is_booked == 1 ? BOOKED : UNBOOKED}
                  />
                  {row.invoice_is_booked == 1 ? (
                    <span
                      className="italic text-sm text-stone-500"
                      style={{ fontSize: "9px" }}
                    >
                      {new Date(row.invoice_is_booked_date)
                        .toISOString()
                        .slice(0, 10)}
                    </span>
                  ) : null}
                </span>
              );

              const status = (
                <div className="flex flex-col items-center">
                  {row.invoice_status === "paid" ? (
                    <div className="text-center text-white w-fit px-3 py-[2px] rounded-full bg-blue-500">
                      Paid{" "}
                      <span className="whitespace-nowrap">
                        ({row.invoice_paid_date})
                      </span>
                    </div>
                  ) : (
                    <StatusChip status={getInvoiceStatus(row)} />
                  )}
                  {row.invoice_has_credit_note != 0 ? (
                    <div className="mt-1 text-center text-white w-fit px-3 py-[2px] rounded-full bg-red-500">
                      Has Credit Note
                    </div>
                  ) : null}
                  {row.invoice_is_exported_by ? (
                    <div className="mt-1 text-[11px] text-[#797979]">
                      <div>
                        <strong>EXPORTED BY:</strong> {row.exporter}
                      </div>
                      <div>{row.invoice_is_exported_date}</div>
                    </div>
                  ) : null}
                </div>
              );

              const actions = (
                <MoreOption>
                  {dashboard ? (
                    <>
                      <Link
                        href={`/projects/invoices/${row._invoice_id}`}
                        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                      >
                        <ViewIcon className="w-[18px] h-[18px] text-purple-500" />
                        <span className="text-sm font-medium">View</span>
                      </Link>
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
                      <Separator className="my-2" />
                      <div
                        onClick={() => handleClickHistory(row._invoice_id)}
                        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                      >
                        <History className="w-[18px] h-[18px] text-blue-500" />
                        <span className="text-sm font-medium">History</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link
                        href={`/projects/invoices/${row._invoice_id}`}
                        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                      >
                        <ViewIcon className="w-[18px] h-[18px] text-purple-500" />
                        <span className="text-sm font-medium">View</span>
                      </Link>
                      {isOpen(row) ? (
                        <>
                          <Link
                            href={`/projects/invoices/${row._invoice_id}/edit`}
                            className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                          >
                            <Pencil className="w-[18px] h-[18px] text-blue-500" />
                            <span className="text-sm font-medium">Update</span>
                          </Link>
                          <div
                            onClick={() => mutateDelete(row._invoice_id)}
                            className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                          >
                            <Trash2 className="w-[18px] h-[18px] text-red-500" />
                            <span className="text-sm font-medium">Delete</span>
                          </div>
                        </>
                      ) : null}
                      <div
                        onClick={() => mutateCopy(row._invoice_id)}
                        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                      >
                        <Copy className="w-[18px] h-[18px] text-teal-500" />
                        <span className="text-sm font-medium">Copy</span>
                      </div>
                      <Separator className="my-2" />
                      <ExportAbacusButton
                        onView={() => handleViewAbacusExported(row)}
                        exported_by={row.invoice_is_exported_by}
                        onExport={() => handleAbacusExport(row)}
                      />
                      <CreateMarkAsPaidButton
                        isPaid={row.invoice_status}
                        onPaid={() => mutatePaid(row._invoice_id)}
                        onUnpaid={() => mutateUnpaid(row._invoice_id)}
                      />
                      {canBook(row) ? (
                        <CreateBookButton
                          isBooked={row.invoice_is_booked == 1}
                          onBook={() => mutateBook(row._invoice_id, true)}
                          onUnbook={() => mutateBook(row._invoice_id, false)}
                        />
                      ) : null}
                      <Separator className="my-2" />
                      <CreateOfferButton
                        _offer_id={row.invoice_has_offer}
                        onCreate={() => mutateCreateOffer(row._invoice_id)}
                      />
                      <CreateOrderConfirmationButton
                        _order_confirmation_id={
                          row.invoice_has_order_confirmation
                        }
                        onCreate={() =>
                          mutateCreateOrderConfirmation(row._invoice_id)
                        }
                      />
                      <CreateCreditNoteButton
                        _credit_note_id={row.invoice_has_credit_note}
                        credit_note_number={row.invoice_original_number}
                        onCreate={() => mutateCreateCreditNote(row._invoice_id)}
                      />
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
                      <Separator className="my-2" />
                      <div
                        onClick={() => handleClickHistory(row._invoice_id)}
                        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                      >
                        <History className="w-[18px] h-[18px] text-blue-500" />
                        <span className="text-sm font-medium">History</span>
                      </div>
                    </>
                  )}
                </MoreOption>
              );

              if (dashboard) {
                return (
                  <tr key={key} className={`group ${getStatusColor(row)}`}>
                    <TD className="ps-4 align-top">{invoiceNumber}</TD>
                    <TD className="align-top w-[350px]">{client}</TD>
                    <TD className="align-top">{totalAmount}</TD>
                    <TD className="align-top">{addedBy}</TD>
                    <TD className="align-top">{booked}</TD>
                    <TD className="align-top text-right pe-4">{actions}</TD>
                  </tr>
                );
              }

              return (
                <tr key={key} className={`group ${getStatusColor(row)}`}>
                  <TD className="ps-4 align-top">{invoiceNumber}</TD>
                  <TD className="align-top w-[350px]">{client}</TD>
                  <TD className="align-top">{description}</TD>
                  <TD className="align-top">{currency}</TD>
                  <TD className="align-top">{totalAmount}</TD>
                  <TD className="align-top">{openAmount}</TD>
                  <TD className="align-top">{invoiceDate}</TD>
                  <TD className="align-top">{dueDate}</TD>
                  <TD className="align-top">{addedBy}</TD>
                  <TD className="align-top">{booked}</TD>
                  <TD className="align-top">{status}</TD>
                  <TD className="align-top text-right pe-4">{actions}</TD>
                </tr>
              );
            })}
            {Array.isArray(data?.invoice) && data.invoice.length === 0 && (
              <tr>
                <td
                  colSpan={dashboard ? 6 : 12}
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
