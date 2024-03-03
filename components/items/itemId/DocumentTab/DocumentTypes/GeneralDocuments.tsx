import { SelectAll, TD, TH } from "@/components/items";
import Pagination from "@/components/pagination";
import { document_type_format } from "@/components/projects/project-page/ProjectDetails/Documents/AutomaticDocument/AutoDocumentFilter";
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
import { toast } from "@/components/ui/use-toast";
import { doc_employee_base, doc_equipment_base } from "@/lib/azureUrls";
import { cn } from "@/lib/utils";
import { fetchApi } from "@/utils/api.config";
import { avatarFallback } from "@/utils/avatar";
import dayjs from "dayjs";
import { FileText } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { memo, useState } from "react";
import useSWR from "swr";

const GeneralDocument = (props: GeneralDocumentProps) => {
  const { access_token, _item_id } = props;
  const router = useRouter();
  const [page, setPage] = useState(1);
  let paramsObj: any = {};
  paramsObj["page"] = page;
  paramsObj["item_id"] = router?.query.item_id;
  paramsObj["type"] = "general";
  paramsObj["per_page"] = 8;
  let searchParams = new URLSearchParams(paramsObj);

  const { data, isLoading, error, mutate } = useSWR(
    [
      `/api/items/document/general_document?${searchParams.toString()}`,
      access_token,
    ],
    fetchApi
  );

  const onPreview = (dir: any) => {
    if (dir.document_file_name) {
      const a = document.createElement("a");
      a.target = "_blank";
      a.href = `${doc_equipment_base}/${dir.document_file_name}`;
      a.click();
    } else {
      toast({
        title: "Problem encounter upon viewing file.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <>
      <div className="shadow-sm rounded-xl overflow-hidden bg-white">
        <div className="flex ps-1 bg-red-10 py-2 gap-1 justify-between pe-3">
          <div className="px-2">
            <p className="font-medium text-lg">General Documents</p>
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
              <TH className="ps-4">Name</TH>
              <TH>Filename</TH>
              <TH>Added By</TH>
              <TH>Date Added</TH>
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
              data.documents.map((document: any, key: number) => (
                <tr key={key} className="hover:bg-stone-50 group">
                  <TD className="text-sm ps-4">
                    <div className="flex items-center">
                      <span>{document.document_name}</span>
                    </div>
                  </TD>
                  <TD className="text-sm">
                    <span
                      className="hover:text-blue-400 hover:underline hover:underline-offset-1 hover:cursor-pointer"
                      onClick={() => onPreview(document)}
                    >
                      {document.document_file_name}
                    </span>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <TooltipProvider delayDuration={400}>
                        <Tooltip>
                          <TooltipTrigger>
                            <Avatar className="w-9 h-9">
                              <AvatarImage
                                src={document.user_photo}
                                alt={
                                  document.user_lastname +
                                  " " +
                                  document.user_lastname
                                }
                              />
                              <AvatarFallback
                                className="font-medium text-white"
                                style={{ background: document.avatar_color }}
                              >
                                {avatarFallback(
                                  document.user_firstname || "N",
                                  document.user_lastname || "A"
                                )}
                              </AvatarFallback>
                            </Avatar>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {(document.user_firstname || "N") +
                                " " +
                                (document.user_lastname || "A")}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      {document.user_firstname + " " + document.user_lastname}
                    </div>
                  </TD>
                  <TD className="text-sm">
                    {dayjs(document.added_date).format("DD/MM/YYYY hh:mm a")}
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
    </>
  );
};

export default memo(GeneralDocument);

type GeneralDocumentProps = {
  _item_id?: any;
  access_token?: any;
};
