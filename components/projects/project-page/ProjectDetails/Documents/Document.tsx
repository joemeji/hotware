import { TD, TH } from "@/components/items";
import { Button } from "@/components/ui/button";
import { AccessTokenContext } from "@/context/access-token-context";
import { ProjectDetailsContext } from "@/pages/projects/[project_id]";
import { fetchApi } from "@/utils/api.config";
import {
  Download,
  DownloadCloud,
  MinusCircle,
  Search,
  Upload,
} from "lucide-react";
import { useContext } from "react";
import useSWR from "swr";

const Document = () => {
  const access_token = useContext(AccessTokenContext);
  const payload: any = {};
  const queryString = new URLSearchParams(payload).toString();
  const project = useContext(ProjectDetailsContext);

  const { data, isLoading, error, mutate } = useSWR(
    [
      `/api/projects/${project?.data?._project_id}/document/uploads?${queryString}`,
      access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  console.log(project);

  return (
    <div className="flex flex-col gap-2 w-1/2">
      <p className="text-base font-medium">Manual Documents</p>
      <div className="flex bg-background rounded-xl flex-col overflow-hidden shadow">
        <div className="p-3 flex justify-between items-center">
          <Button className="py-1 flex items-center gap-2" variant={"outline"}>
            <Download className="w-[18px] text-purple-600" /> Download
          </Button>
          <div className="flex items-center gap-2">
            <Button
              className="py-1 flex items-center gap-2"
              variant={"outline"}
            >
              <Upload className="w-[18px] text-orange-600" /> Upload File
            </Button>
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
              <TH>Document Name</TH>
              <TH>File Name</TH>
              <TH className="text-right pe-4">Action</TH>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((doc: any, key: number) => (
                <tr key={key} className="hover:bg-stone-100/20">
                  <TD className="font-medium">{doc.project_document_name}</TD>
                  <TD>{doc.project_document_file}</TD>
                  <TD className="text-right pe-4">
                    <div className="flex gap-1 justify-end">
                      <Button className="py-1 px-2.5" variant={"secondary"}>
                        <DownloadCloud className="w-[17px] text-purple-600" />
                      </Button>
                      <Button className="py-1 px-2.5" variant={"secondary"}>
                        <MinusCircle className="w-[17px] text-red-600" />
                      </Button>
                    </div>
                  </TD>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Document;
