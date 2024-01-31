import { ItemMenu, TD, TH } from "@/components/items";
import { CmsDetailsContext } from "@/pages/address-manager/[cms_id]";
import { baseUrl, fetcher } from "@/utils/api.config";
import { memo, useContext, useState } from "react";
import useSWR from "swr";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AvatarProfile from "@/components/AvatarProfile";
import MoreOption from "@/components/MoreOption";
import Pagination from "@/components/pagination";
import { FileSearch, FileText, MoveUpRight, Sheet } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { previewPdf } from "@/services/projects/invoice";
import { AccessTokenContext } from "@/context/access-token-context";

const List = () => {
  const cms: any = useContext(CmsDetailsContext);
  const [page, setPage] = useState(1);
  const access_token = useContext(AccessTokenContext);

  const queryString = new URLSearchParams({ page: String(page) }).toString();

  let { data, isLoading, error } = useSWR(
    `/api/cms/${cms?._cms_id}/invoice?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const cms_address = (row: any) => {
    const address = [
      row.cms_address_building || null,
      row.cms_address_street || null,
      row.cms_address_city || null,
      row.cms_address_country || null,
    ];
    return address.filter((text: any) => text !== null).join(", ");
  };

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
    let filename = res.headers.get('Title');
    const a = document.createElement("a");
    a.href = objectURL;
    a.download = filename as string + ".pdf";
    a.click();
  }

  return (
    <>
      <table className="w-full">
        <thead>
          <tr>
            <TH className="ps-4">No.</TH>
            <TH className="w-[60%]">Description</TH>
            <TH>Date</TH>
            <TH>Added By</TH>
            <TH className="text-right">Actions</TH>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data?.invoices) && data.invoices.length === 0 && (
            <tr>
              <td colSpan={5}>
                <div className="flex justify-center">
                  <Image
                    src="/images/No data-rafiki.svg"
                    width={300}
                    height={300}
                    alt="No Data to Shown"
                  />
                </div>
              </td>
            </tr>
          )}
          {isLoading && (
            <tr>
              <td className="p-2 pt-3 text-center" colSpan={5}>
                <div className="flex flex-col gap-2 items-center">
                  <Skeleton className="w-[250px] h-[20px]" />
                  <Skeleton className="w-[100px] h-[20px]" />
                </div>
              </td>
            </tr>
          )}
          {Array.isArray(data?.invoices) &&
            data.invoices.map((row: any, key: number) => (
              <tr key={key} className="hover:bg-stone-100">
                <TD className="ps-4 group-last:border-b-0 font-medium align-top">
                  {row.invoice_number}
                </TD>
                <TD className="group-last:border-b-0 align-top">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">
                      {row.invoice_description}
                    </span>
                    <span className="opacity-70">{cms_address(row)}</span>
                  </div>
                </TD>
                <TD className="group-last:border-b-0 align-top">
                  {row.invoice_date}
                </TD>
                <TD className="group-last:border-b-0">
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
                <TD className="text-right group-last:border-b-0 align-top">
                  <MoreOption>
                    <ItemMenu className="gap-3">
                      <MoveUpRight className="w-[18px] h-[18px] text-blue-500" />
                      <span className="font-medium">View</span>
                    </ItemMenu>
                    <ItemMenu
                      className="gap-3"
                      onClick={() => onPreviewPdf(row)}
                    >
                      <FileSearch className="w-[18px] h-[18px] text-purple-500" />
                      <span className="font-medium">Preview</span>
                    </ItemMenu>
                    {/* <ItemMenu className="gap-3">
                      <Sheet className="w-[18px] h-[18px] text-green-500" />
                      <span className="font-medium">Save as Excel</span>
                    </ItemMenu> */}
                    <ItemMenu
                      className="gap-3"
                      onClick={() => onDownloadPdf(row)}>
                      <FileText className="w-[18px] h-[18px] text-red-500" />
                      <span className="font-medium">Save as Pdf</span>
                    </ItemMenu>
                  </MoreOption>
                </TD>
              </tr>
            ))}
        </tbody>
      </table>
      {data && data.pager && (
        <div className="mt-auto">
          <Pagination
            pager={data.pager}
            onPaginate={(page) => setPage(page)}
            currPage={page}
          />
        </div>
      )}
    </>
  );
};

export default memo(List);
