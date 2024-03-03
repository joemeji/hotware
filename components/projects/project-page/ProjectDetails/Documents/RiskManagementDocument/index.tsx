import { ItemMenu, TD, TH } from "@/components/items";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  DownloadCloud,
  FileText,
  Loader2,
  Search,
  Sheet,
} from "lucide-react";
import { useContext, useState } from "react";
import { AccessTokenContext } from "@/context/access-token-context";
import useSWR from "swr";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import MoreOption from "@/components/MoreOption";
import { useRouter } from "next/router";
import { cn } from "@/lib/utils";
import { ProjectDetailsContext } from "@/pages/projects/[project_id]";

const RiskManagementDocument = () => {
  const access_token = useContext(AccessTokenContext);
  const payload: any = {};
  const queryString = new URLSearchParams(payload).toString();
  const [loadingDownload, setLoadingDownload] = useState(false);
  const router = useRouter();
  const project = useContext(ProjectDetailsContext);

  const { data, isLoading, error, mutate } = useSWR(
    [`/api/document/risk-management/all?${queryString}`, access_token],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const onDownload = async (type: "excel" | "pdf") => {
    try {
      setLoadingDownload(true);
      const res = await fetch(
        `${baseUrl}/api/document/risk-management/${
          type === "excel" ? "download_as_zip_excel" : "download_as_zip_pdf"
        }/${router.query.project_id}`,
        {
          method: "post",
          headers: authHeaders(access_token),
        }
      );
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = `Risk Assessment Documents (${
        type === "excel" ? "Excel" : "PDF"
      }).zip`;
      a.href = url;
      a.click();
    } catch (err) {
      console.log(err);
    } finally {
      setLoadingDownload(false);
    }
  };

  const onDownloadSingle = async (rmName: any, type: "excel" | "pdf") => {
    try {
      const res = await fetch(
        `${baseUrl}/api/document/risk-management/${
          type === "excel" ? "download_excel" : "download_pdf"
        }/${router.query.project_id}/${rmName}`,
        {
          method: "post",
          headers: authHeaders(access_token),
        }
      );
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.download = `${rmName} (${type === "excel" ? "Excel" : "PDF"})`;
      a.href = url;
      a.click();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <p className="text-base font-medium">Risk Managements</p>

      <div className="flex bg-background rounded-xl flex-col overflow-hidden shadow">
        <div className="p-3 flex justify-between items-center">
          <MoreOption
            menuTriggerChildren={
              <Button
                className={cn(
                  "py-1 flex items-center gap-2 pe-2.5",
                  loadingDownload && "loading"
                )}
                variant={"outline"}
                disabled={loadingDownload}
              >
                Download <ChevronDown className="w-[18px]" />
              </Button>
            }
          >
            <ItemMenu onClick={() => onDownload("excel")}>
              <Sheet className="w-[18px] text-green-600" />
              <span className="font-medium ms-2">Excel</span>
            </ItemMenu>
            <ItemMenu onClick={() => onDownload("pdf")}>
              <FileText className="w-[18px] text-red-600" />
              <span className="font-medium ms-2">PDF</span>
            </ItemMenu>
          </MoreOption>
          <div className="flex items-center gap-2">
            <form>
              <div className="bg-stone-100 flex items-center w-[300px] rounded-xl overflow-hidden px-2 h-9 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-visible:ring-offset-2">
                <Search className="text-stone-400 w-5 h-5" />
                <input
                  placeholder="Search"
                  className="border-0 rounded-none outline-none text-sm w-full px-2 bg-stone-100 h-full max-w-[300px]"
                  name="search"
                />
              </div>
            </form>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <TH className="ps-4">#</TH>
              <TH>Document</TH>
              <TH className="pe-4 text-right">Action</TH>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((item: any, key: number) => (
                <tr key={key} className="hover:bg-stone-100/20">
                  <TD className="ps-4 font-medium">{key + 1}</TD>
                  <TD className="font-medium">{item.risk_management_name}</TD>
                  <TD className="pe-4 text-right">
                    <MoreOption
                      menuTriggerChildren={
                        <Button className="py-1 px-2.5" variant={"secondary"}>
                          <DownloadCloud className="w-[17px] text-purple-600" />
                        </Button>
                      }
                    >
                      <ItemMenu
                        onClick={() =>
                          onDownloadSingle(item.risk_management_name, "excel")
                        }
                      >
                        <Sheet className="w-[18px] text-green-600" />
                        <span className="font-medium ms-2">Excel</span>
                      </ItemMenu>
                      <ItemMenu
                        onClick={() =>
                          onDownloadSingle(item.risk_management_name, "pdf")
                        }
                      >
                        <FileText className="w-[18px] text-red-600" />
                        <span className="font-medium ms-2">PDF</span>
                      </ItemMenu>
                    </MoreOption>
                  </TD>
                </tr>
              ))}
            {Array.isArray(data) && data.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="py-5 opacity-50 text-center font-bold text-lg"
                >
                  No Records Found.
                </td>
              </tr>
            )}

            {(project?.isLoading || isLoading) && (
              <tr>
                <td className="px-3 py-2" colSpan={3}>
                  <Loader2 className="animate-spin mx-auto m-5" />
                </td>
              </tr>
            )}

            {Array.isArray(data) && data.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="py-5 opacity-50 text-center font-bold text-lg"
                >
                  No Records Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskManagementDocument;
