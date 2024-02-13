import { TD, TH } from "@/components/items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Download, Filter, Search } from "lucide-react";

const AutomaticDocument = () => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <p className="text-base font-medium">Automated Documents</p>
      <div className="flex bg-background rounded-xl w-full flex-col overflow-hidden shadow">
        <AutomaticDocumentHeading />
        <table className="w-full">
          <thead>
            <tr>
              <TH>Owner</TH>
              <TH>Document</TH>
              <TH>Description</TH>
              <TH>Category</TH>
              <TH>Expiry Date</TH>
              <TH>Language</TH>
              <TH>File</TH>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                colSpan={7}
                className="py-5 opacity-50 text-center font-bold text-lg"
              >
                No Records Found.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AutomaticDocument;

const AutomaticDocumentHeading = () => {
  return (
    <div className="flex p-3 justify-between">
      <Button className="py-1 flex items-center gap-2" variant={"outline"}>
        <Download className="w-[18px] text-purple-600" /> Download
      </Button>
      <div className="flex items-center gap-1">
        <Button
          className="py-1.5 flex items-center gap-2 px-3"
          variant={"ghost"}
        >
          <Filter className="w-[18px]" />
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
  );
};
