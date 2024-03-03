import { ArrowUpRightSquare } from "lucide-react";
import { useContext, useState } from "react";
import { AccessTokenContext } from "@/context/access-token-context";
import { fetchApi } from "@/utils/api.config";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import Link from "next/link";
import Pagination from "../pagination";
import { Skeleton } from "../ui/skeleton";
import useSWR from "swr";
import { TD, TH } from "../items";
import { File } from "lucide-react";
import SearchInput from "../app/search-input";

export default function Documents() {
  const access_token = useContext(AccessTokenContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<any>("");

  let param: any = {};
  param["page"] = page;

  if (search) param = { search };

  let searchParams = new URLSearchParams(param);

  const { data, isLoading, error } = useSWR(
    [`/api/document/dashboard_docs?${searchParams.toString()}`, access_token],
    fetchApi
  );

  return (
    <div className="rounded-xl bg-white w-full shadow">
      <ScrollArea viewPortClassName="min-h-[400px] max-h-[700px]">
        <div className="flex justify-between items-center rounded-t-xl py-2 px-3 sticky top-0 backdrop-blur-sm bg-background/30 pb-2">
          <p className="text-lg flex font-medium">Documents</p>
          <div className="flex items-center gap-2">
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              delay={1000}
              placehoder={"Search Document only"}
            />
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr>
              <TH className="font-medium">Document Name</TH>
              <TH className="font-medium">Document Holder</TH>
              <TH className="font-medium">Expiry Date</TH>
              <TH className="font-medium">Modified Date</TH>
              <TH className="font-medium">Action</TH>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td colSpan={5}>
                  <div className="flex flex-col gap-2 p-3">
                    <Skeleton className="w-[300px] h-[15px]" />
                    <Skeleton className="w-[150px] h-[15px]" />
                  </div>
                </td>
              </tr>
            )}
            {Array.isArray(data?.list) &&
              data.list.map((item: any, key: number) => (
                <tr key={key}>
                  <TD>
                    <div className="flex items-center gap-1">
                      <File className="text-red-300 fill-red-300 w-[18px] h-[18px]" />
                      <span className="font-medium">{item.document_name}</span>
                    </div>
                  </TD>
                  <TD>{item.holder}</TD>
                  <TD>{item.document_expiry_date}</TD>
                  <TD>{item.modified_date}</TD>
                  <TD>
                    <Link
                      href={`/documents/${item.document_type.toLowerCase()}`}
                      target="_blank"
                    >
                      <Button
                        className="py-1 flex items-center gap-2 px-2"
                        variant={"secondary"}
                      >
                        <ArrowUpRightSquare
                          className="text-purple-600 w-[18px] h-[18px]"
                          strokeWidth={1}
                        />
                        View
                      </Button>
                    </Link>
                  </TD>
                </tr>
              ))}
          </tbody>
        </table>

        {data?.pager && (
          <div>
            <Pagination
              currPage={page}
              pager={data.pager}
              onPaginate={(p) => setPage(p)}
            />
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
