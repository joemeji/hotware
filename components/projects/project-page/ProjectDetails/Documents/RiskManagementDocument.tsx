import { TD, TH } from "@/components/items";
import { Button } from "@/components/ui/button";
import { ChevronDown, Download, DownloadCloud, Search } from "lucide-react";
import { useContext } from "react";
import { AccessTokenContext } from "@/context/access-token-context";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";

const RiskManagementDocument = () => {
  const access_token = useContext(AccessTokenContext);
  const payload: any = {};
  const queryString = new URLSearchParams(payload).toString();

  const { data, isLoading, error, mutate } = useSWR(
    [`/api/document/risk-management/all?${queryString}`, access_token],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return (
    <div className="flex flex-col gap-2 w-1/2">
      <p className="text-base font-medium">Risk Managements</p>

      <div className="flex bg-background rounded-xl flex-col overflow-hidden shadow">
        <div className="p-3 flex justify-between items-center">
          <Button
            className="py-1 flex items-center gap-2 pe-2.5 ps-2.5"
            variant={"outline"}
          >
            <Download className="w-[18px] text-purple-600" />
            Download <ChevronDown className="w-[18px]" />
          </Button>
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
                    <Button className="py-1 px-2.5" variant={"secondary"}>
                      <DownloadCloud className="w-[17px] text-purple-600" />
                    </Button>
                  </TD>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RiskManagementDocument;
