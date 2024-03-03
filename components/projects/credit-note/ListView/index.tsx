import AvatarProfile from "@/components/AvatarProfile";
import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import {
  ArrowRight,
  Pencil,
  History,
  Trash2,
  FileSearch,
  FileText,
  CoinsIcon,
  Search,
} from "lucide-react";
import Pagination from "@/components/pagination";
import { StatusChip } from "@/components/projects/credit-note/StatusChip";
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
import { getCreditStatus, isExported } from "@/lib/credit";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { useDelete } from "@/components/projects/credit-note/useDelete";
import { useChangeBookStatus } from "@/components/projects/credit-note/useChangeBookStatus";
import { previewPdf } from "@/services/projects/credit";
import { ExportAbacusButton } from "@/components/projects/buttons/ExportAbacusButton";
import AbacusExportModal from "@/components/projects/credit-note/modals/AbacusExportModal";
import ViewAbacusExportModal from "@/components/projects/credit-note/modals/ViewAbacusExportModal";
import SearchInput from "@/components/app/search-input";

const ActivityLogSheetModal = dynamic(
  () => import("@/components/projects/credit-note/modals/ActivityLogSheetModal")
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
  const [isConnected, setIsConnected] = useState(false);
  const [selectedCreditNote, setSelectedCreditNote] = useState<
    string | undefined
  >();
  const [activityOpen, setActivityOpen] = useState(false);
  const [list, setList] = useState<any>(null);
  const [exportAbacus, setExportAbacus] = useState<boolean>(false);
  const [exportAbacusCreditNote, setExportAbacusCreditNote] =
    useState<any>(null);
  const [viewExportedAbacus, setViewExportedAbacus] = useState<boolean>(false);

  const payload: any = {};
  if (_project_id) payload["_project_id"] = _project_id;

  payload["page"] = router.query.page || 1;

  if (router.query.search) payload["search"] = router.query.search;
  if (onProject) payload["search"] = search;

  const queryString = new URLSearchParams(payload).toString();

  const { data, isLoading, mutate } = useSWR(
    [`/api/projects/credits?${queryString}`, access_token],
    fetchApi,
    {
      revalidateOnFocus: true,
      revalidateIfStale: false,
    }
  );

  const { mutateDelete, Dialog: DeleteDialog } = useDelete({
    onDelete: (item: string) => {
      const credit_note =
        list?.credit_note?.filter(
          (credit_note: any) => credit_note._credit_note_id != item
        ) || [];
      setList({ ...list, credit_note });
    },
  });

  const { mutateBook, Dialog: BookDialog } = useChangeBookStatus({
    onBook: (item: string, isBooked: boolean) => {
      mutate();
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

  const handleClickHistory = (_credit_note_id: string | undefined) => {
    setSelectedCreditNote(_credit_note_id);
    setActivityOpen(true);
  };

  useEffect(() => {
    setList(data);
  }, [data]);

  useEffect(() => {
    const checkAbacusConnection = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/api/projects/credits/settings/check-connection`,
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

  const onPreviewPdf = async (credit: any) => {
    const res = await previewPdf(credit?._credit_note_id, access_token);
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectURL;
    a.target = "_blank";
    a.click();
  };

  const onDownloadPdf = async (credit: any) => {
    const res = await previewPdf(credit?._credit_note_id, access_token);
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);
    let filename = res.headers.get("Title");
    const a = document.createElement("a");
    a.href = objectURL;
    a.download = (filename as string) + ".pdf";
    a.click();
  };

  const handleAbacusExport = (credit: any) => {
    setExportAbacus(true);
    setExportAbacusCreditNote(credit);
  };

  const handleViewAbacusExported = (credit: any) => {
    setViewExportedAbacus(true);
    setExportAbacusCreditNote(credit);
  };

  return (
    <>
      <DeleteDialog />
      <BookDialog />
      <ActivityLogSheetModal
        _credit_note_id={selectedCreditNote}
        open={activityOpen}
        onOpenChange={(open: any) => setActivityOpen(open)}
      />
      <AbacusExportModal
        open={exportAbacus}
        onOpenChange={setExportAbacus}
        credit_note={exportAbacusCreditNote}
        onSubmit={() => {
          mutate([`/api/projects/credits?${queryString}`, access_token]);
        }}
      />
      <ViewAbacusExportModal
        open={viewExportedAbacus}
        onOpenChange={setViewExportedAbacus}
        _credit_note_id={exportAbacusCreditNote?._credit_note_id}
      />
      <div className="bg-white w-full rounded-xl shadow">
        <div className="flex justify-between items-center py-2 px-3">
          <p className="text-lg flex font-medium">Credit Notes</p>
          <div className="flex items-center gap-2">
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
              <TH className="ps-4">Credit No.</TH>
              <TH>Client</TH>
              <TH>Description</TH>
              <TH>Currency</TH>
              <TH>Amount</TH>
              <TH className="w-[200px]">Date</TH>
              <TH>Added By</TH>
              <TH>Booked</TH>
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
            {list?.credit_note?.map((row: any, key: number) => (
              <tr key={key} className="group">
                <TD className="ps-4 align-top">
                  <Link href={`${router.pathname}/${row._credit_note_id}`}>
                    <span className="text-blue-600 font-medium">
                      {row.credit_note_number}
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
                    {row.credit_note_description} &nbsp;
                  </span>
                </TD>
                <TD className="align-top">
                  <span className="text-sm">{row.currency}</span>
                </TD>
                <TD className="align-top">
                  <span className="text-sm">
                    {row.credit_note_total.toLocaleString()}
                  </span>
                </TD>
                <TD className="align-top">
                  <span className="text-sm">
                    {row?.credit_note_document_date ||
                      row?.credit_note_date ||
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
                  <StatusChip status={getCreditStatus(row)} />
                  {isExported(row) ? (
                    <span
                      className="italic text-sm text-stone-500"
                      style={{ fontSize: "10px" }}
                    >
                      {row.credit_note_is_exported_date}
                    </span>
                  ) : null}
                </TD>
                <TD className="align-top text-right pe-4">
                  <MoreOption>
                    <Link
                      href={`/projects/credit-note/${row._credit_note_id}`}
                      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                    >
                      <ArrowRight className="w-[18px] h-[18px] text-violet-500" />
                      <span className="text-sm font-medium">View</span>
                    </Link>
                    {!isExported(row) ? (
                      <>
                        <Link
                          href={`/projects/credit-note/${row._credit_note_id}/edit`}
                          className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                        >
                          <Pencil className="w-[18px] h-[18px] text-blue-500" />
                          <span className="text-sm font-medium">Update</span>
                        </Link>
                        <div
                          onClick={() => mutateDelete(row._credit_note_id)}
                          className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                        >
                          <Trash2 className="w-[18px] h-[18px] text-red-500" />
                          <span className="text-sm font-medium">Delete</span>
                        </div>
                      </>
                    ) : null}
                    <Separator className="my-2" />
                    {isConnected && (
                      <ExportAbacusButton
                        onView={() => handleViewAbacusExported(row)}
                        exported_by={row.credit_note_is_exported_by}
                        onExport={() => handleAbacusExport(row)}
                      />
                    )}

                    {!isExported(row) ? (
                      <div
                        onClick={() =>
                          mutateBook(
                            row._credit_note_id,
                            row.credit_note_is_booked
                          )
                        }
                        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                      >
                        <CoinsIcon
                          className={`w-[18px] h-[18px] ${
                            parseInt(row.credit_note_is_booked) == 1
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        />
                        <span className="text-sm font-medium">
                          {parseInt(row.credit_note_is_booked) == 1
                            ? "Unbook"
                            : "Book"}{" "}
                          (Accounting)
                        </span>
                      </div>
                    ) : null}

                    <Separator className="my-2" />
                    <Link
                      href={`/projects/invoices/${row._invoice_id}`}
                      className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                    >
                      <FileText className="w-[18px] h-[18px] text-violet-500" />
                      <span className="text-sm font-medium">Open Invoice</span>
                    </Link>
                    <Separator className="my-2" />
                    <div
                      onClick={() => handleClickHistory(row._credit_note_id)}
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
            {Array.isArray(data?.credit_note) &&
              data.credit_note.length === 0 && (
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
