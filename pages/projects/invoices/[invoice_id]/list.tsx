import AvatarProfile from "@/components/AvatarProfile";
import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import AdminLayout from "@/components/admin-layout";
import {
  ViewIcon,
  Pencil,
  History,
  Trash2,
  FileSearch,
  FileText,
  Copy,
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
import { BOOKED, UNBOOKED, getInvoiceStatus, isOpen } from "@/lib/invoice";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { baseUrl, fetchApi } from "@/utils/api.config";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
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

const ActivityLogSheetModal = dynamic(
  () => import("@/components/projects/invoices/modals/ActivityLogSheetModal")
);

export default function Invoices({ access_token, invoice_number }: any) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<string | undefined>();
  const [activityOpen, setActivityOpen] = useState(false);
  const [list, setList] = useState<any>(null);

  const payload: any = {};
  if (router.query.page) payload["page"] = router.query.page;
  if (router.query.search) payload["search"] = router.query.search;
  const queryString = new URLSearchParams(payload).toString();

  const { data, isLoading, mutate } = useSWR(
    [
      `/api/projects/invoices/${invoice_number}/list?${queryString}`,
      access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
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

  const onPaginate = (page: string) => {
    router.query.page = page;
    router.push(router);
  };

  const onSearch = () => {
    if (!search) return;
    router.query.search = search;
    router.push(router);
  };

  const handleClickHistory = (_invoice_id: string | undefined) => {
    setSelectedInvoice(_invoice_id);
    setActivityOpen(true);
  };

  useEffect(() => {
    setList(data);
  }, [data]);

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

  return (
    <AdminLayout>
      <DeleteDialog />
      <CopyDialog />
      <MarkAsPaidDialog />
      <MarkAsUnpaidDialog />
      <BookDialog />
      <OfferDialog />
      <OrderConfirmationDialog />
      <CreateNoteDialog />
      <ActivityLogSheetModal
        _invoice_id={selectedInvoice}
        open={activityOpen}
        onOpenChange={(open: any) => setActivityOpen(open)}
      />
      <div className="p-[20px] w-full max-w-[1600px] mx-auto">
        <div className="bg-white w-full rounded-sm shadow-sm">
          <div className="flex justify-between p-4 items-center">
            <p className="text-xl flex font-medium">
              Invoices for {list?.invoice_number || ""}
            </p>
            <form onSubmit={onSearch}>
              <Input
                type="search"
                placeholder="Search"
                className="rounded-xl placeholder:text-stone-400 w-[400px]"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            <Link href="/projects/invoices/create">
              <Button>New invoice</Button>
            </Link>
          </div>
          <table className="w-full">
            <thead className="sticky z-10 top-0">
              <tr>
                <TH className="ps-4">invoice No.</TH>
                <TH>Client</TH>
                <TH>Description</TH>
                <TH>Currency</TH>
                <TH>Amount (Total)</TH>
                <TH>Amount (Open)</TH>
                <TH>Invoice Date</TH>
                <TH>Due Date</TH>
                <TH>Added By</TH>
                <TH>Booked</TH>
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
              {list?.invoice?.map((row: any, key: number) => (
                <tr key={key} className="group">
                  <TD className="ps-4 align-top">
                    <Link href={`${router.pathname}/${row._invoice_id}`}>
                      <span className="text-blue-600 font-medium">
                        {row.invoice_number}
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
                    <span className="text-sm">{row.invoice_description}</span>
                  </TD>
                  <TD className="align-top">
                    <span className="text-sm">{row.currency}</span>
                  </TD>
                  <TD className="align-top">
                    <span className="text-sm">
                      {row.invoice_total.toLocaleString()}
                    </span>
                  </TD>
                  <TD className="align-top">
                    <span className="text-sm">
                      {(
                        parseFloat(row.invoice_total) -
                        parseFloat(row.invoice_open_amount)
                      ).toLocaleString()}
                    </span>
                  </TD>
                  <TD className="align-top">
                    <span className="text-sm">
                      {row?.invoice_document_date || row?.invoice_date || "--"}
                    </span>
                  </TD>
                  <TD className="align-top">
                    <span className="text-sm">
                      {row.invoice_due_date ? row.invoice_due_date : ""}
                    </span>
                  </TD>
                  <TD className="align-top">
                    <TooltipProvider delayDuration={400}>
                      <Tooltip>
                        <TooltipTrigger>
                          <AvatarProfile
                            firstname={row.user_firstname}
                            lastname={row.user_lastname}
                            photo={
                              baseUrl + "/users/thumbnail/" + row.user_photo
                            }
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
                    <span className="text-sm">
                      <StatusChip
                        status={row.invoice_is_booked == 1 ? BOOKED : UNBOOKED}
                      />
                      {row.invoice_is_booked == 1 ? (
                        <span
                          className="italic text-sm text-stone-500"
                          style={{ fontSize: "10px" }}
                        >
                          {row.invoice_is_booked_date}
                        </span>
                      ) : null}
                    </span>
                  </TD>
                  <TD className="align-top">
                    {row.invoice_status === "paid" ? (
                      <div className="text-[10px] text-center text-white w-fit px-3 py-[2px] rounded-full bg-blue-500">
                        Paid ({row.invoice_paid_date})
                      </div>
                    ) : (
                      <StatusChip status={getInvoiceStatus(row)} />
                    )}
                  </TD>
                  <TD className="align-top text-right pe-4">
                    <MoreOption>
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
                      <CreateMarkAsPaidButton
                        isPaid={row.invoice_status}
                        onPaid={() => mutatePaid(row._invoice_id)}
                        onUnpaid={() => mutateUnpaid(row._invoice_id)}
                      />
                      <CreateBookButton
                        isBooked={row.invoice_is_booked == 1}
                        onBook={() => mutateBook(row._invoice_id, true)}
                        onUnbook={() => mutateBook(row._invoice_id, false)}
                      />
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
                    </MoreOption>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
          {list && list.pager && (
            <div className="mt-auto border-t border-t-stone-100">
              <Pagination
                pager={list.pager}
                onPaginate={(page: any) => onPaginate(page)}
              />
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  let token = null;

  if (session && session.user) {
    token = session.user.access_token;
  } else {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  if (!context?.params?.invoice_id) {
    return {
      redirect: {
        destination: "/projects/invoices",
        permanent: false,
      },
    };
  }

  return {
    props: {
      access_token: token,
      invoice_number: context.params.invoice_id,
    },
  };
}
