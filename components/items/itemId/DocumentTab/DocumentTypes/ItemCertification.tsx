import { SelectAll, TD, TH } from "@/components/items";
import Pagination from "@/components/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { fetchApi } from "@/utils/api.config";
import { avatarFallback } from "@/utils/avatar";
import dayjs from "dayjs";
import { FileText } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import useSWR from "swr";

const ItemCertification = (props: ItemCertificationProps) => {
  const { access_token, _item_id } = props;
  const router = useRouter();
  const [page, setPage] = useState(1);
  let paramsObj: any = {};
  paramsObj["page"] = page;
  paramsObj["item_id"] = router?.query.item_id;
  paramsObj["type"] = "certification";
  paramsObj["per_page"] = 8;
  let searchParams = new URLSearchParams(paramsObj);
  // Lacking Generate PDF Function
  const { data, isLoading, error, mutate } = useSWR(
    [
      `/api/items/document/general_document?${searchParams.toString()}`,
      access_token,
    ],
    fetchApi
  );

  return (
    <div className="mt-5">
      <div className="shadow-sm rounded-xl overflow-hidden bg-white">
        <div className="flex ps-1 bg-red-10 py-2 gap-1 justify-between pe-3">
          <div className="px-2">
            <p className="font-medium text-lg">Item Certifications</p>
          </div>
          <form className="max-w-[300px] w-full">
            <Input
              type="search"
              placeholder="Search"
              className="rounded-xl placeholder:text-stone-400"
            />
          </form>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <TH className="ps-4">Serial No</TH>
              <TH>Report No.</TH>
              <TH>Form</TH>
              <TH>Added By</TH>
              <TH>Date Added</TH>
              <TH className="text-right pe-4">Actions</TH>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="py-3 px-2" colSpan={6}>
                  <div className="flex flex-col gap-4">
                    <Skeleton className="w-[300px] h-[15px]" />
                    <Skeleton className="w-[200px] h-[15px]" />
                  </div>
                </td>
              </tr>
            )}
            {data &&
              Array.isArray(data.documents) &&
              data.documents.length === 0 && (
                <tr>
                  <td colSpan={6}>
                    <div className="flex justify-center">
                      <Image
                        src="/images/No data-rafiki.svg"
                        width={400}
                        height={400}
                        alt="No Data to Shown"
                      />
                    </div>
                  </td>
                </tr>
              )}
            {data &&
              Array.isArray(data.documents) &&
              data.documents.map((report: any, key: number) => (
                <tr key={key} className="hover:bg-stone-50 group">
                  <TD className="text-sm ps-4">
                    <div className="flex items-center">
                      <Checkbox
                        className={cn(
                          "bg-white/80 w-5 h-5 border-2 rounded-full mr-2 invisible group-hover:visible",
                          "data-[state=checked]:visible"
                        )}
                      />
                      <span>{report.serial_number}</span>
                    </div>
                  </TD>
                  <TD>
                    <div className="w-7 h-7 bg-stone-100 flex items-center justify-center rounded-full font-medium text-stone-600 text-sm">
                      {report.form_report_no}
                    </div>
                  </TD>
                  <TD className="text-sm">{report.form_description}</TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <TooltipProvider delayDuration={400}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Avatar className="w-9 h-9">
                              <AvatarImage
                                src={report.user_photo}
                                alt={
                                  report.user_lastname +
                                  " " +
                                  report.user_lastname
                                }
                              />
                              <AvatarFallback
                                className="font-medium text-white"
                                style={{ background: report.avatar_color }}
                              >
                                {avatarFallback(
                                  report.user_firstname || "N",
                                  report.user_lastname || "A"
                                )}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {(report.user_firstname || "N") +
                                " " +
                                (report.user_lastname || "A")}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </TD>
                  <TD className="text-sm">
                    {dayjs(report.form_report_added_date).format(
                      "DD/MM/YYYY hh:mm a"
                    )}
                  </TD>
                  <TD className="text-right pe-4">
                    {/* <Button
                      className="h-auto py-2 rounded-xl px-3"
                      variant="ghost"
                      onClick={() => "Check ItemCertificationController function already exist and routed."}
                    >
                      <FileText className="me-2 w-4 h-4 text-blue-400" />
                      <span className="text-sm text-stone-600 font-normal">
                        PDF
                      </span>
                    </Button> */}
                  </TD>
                </tr>
              ))}
          </tbody>
        </table>
        {data && data.pager && (
          <div className="mt-auto border-t border-t-stone-100">
            <Pagination
              pager={data.pager}
              onPaginate={(page) => setPage(page)}
              currPage={page}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(ItemCertification);

type ItemCertificationProps = {
  _item_id?: any;
  access_token?: any;
};
