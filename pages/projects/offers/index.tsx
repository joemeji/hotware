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
import { getOfferStatus } from "@/lib/offer";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { baseUrl, fetchApi } from "@/utils/api.config";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect, useMemo, useRef } from "react";
import useSWR from "swr";
import dynamic from "next/dynamic";
import { useDelete } from "@/components/projects/offers/useDelete";
import { previewPdf } from "@/services/projects/offer";

const ActivityLogSheetModal = dynamic(
  () => import("@/components/projects/offers/modals/ActivityLogSheetModal")
);

export default function Offers({ access_token }: any) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedOffer, setSelectedOffer] = useState<string | undefined>();
  const [activityOpen, setActivityOpen] = useState(false);
  const [list, setList] = useState<any>(null);

  const payload: any = {};
  if (router.query.page) payload["page"] = router.query.page;
  if (router.query.search) payload["search"] = router.query.search;
  const queryString = new URLSearchParams(payload).toString();

  const { data, isLoading } = useSWR(
    [`/api/projects/offers?${queryString}`, access_token],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  const { mutateDelete, Dialog: DeleteDialog } = useDelete({
    onDelete: (item: string) => {
      const offers =
        list?.offers?.filter((offer: any) => offer._offer_id != item) || [];
      setList({ ...list, offers });
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
    <AdminLayout>
      <DeleteDialog />
      <ActivityLogSheetModal
        _offer_id={selectedOffer}
        open={activityOpen}
        onOpenChange={(open: any) => setActivityOpen(open)}
      />
      <div className="p-[20px] w-full max-w-[1600px] mx-auto">
        <div className="bg-white w-full rounded-sm shadow-sm">
          <div className="flex justify-between p-4 items-center">
            <p className="text-xl flex font-medium">Offers</p>
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
            <Link href="/projects/offers/create">
              <Button>New Offer</Button>
            </Link>
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
                      <Link
                        href={`/projects/offers/${row._offer_id}/edit`}
                        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                      >
                        <Pencil className="w-[18px] h-[18px] text-blue-500" />
                        <span className="text-sm font-medium">Update</span>
                      </Link>
                      <div
                        onClick={() => mutateDelete(row._offer_id)}
                        className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                      >
                        <Trash2 className="w-[18px] h-[18px] text-red-500" />
                        <span className="text-sm font-medium">Delete</span>
                      </div>
                      <Separator className="my-2" />
                      <div
                        onClick={() => handleClickHistory(row._offer_id)}
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

  return {
    props: {
      access_token: token,
    },
  };
}
