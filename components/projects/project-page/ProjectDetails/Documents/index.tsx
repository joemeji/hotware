import { Button } from "@/components/ui/button";
import { ChevronDown, Download, Filter, Search, Upload } from "lucide-react";
import { useState } from "react";
import RiskManagementDocument from "./RiskManagementDocument";
import AutomaticDocument from "./AutomaticDocument";
import ManualDocument from "./ManualDocument";

const Documents = ({ headerSize }: { headerSize?: any }) => {
  return (
    <div className="flex items-start gap-[20px] mt-[10px] flex-col">
      {/* <Heading /> */}

      <AutomaticDocument />
      <div className="flex gap-3 w-full">
        <RiskManagementDocument />
        <ManualDocument />
      </div>
    </div>
  );
};

export default Documents;

// const Heading = () => {
//   return (
//     <div className="flex justify-between items-center w-full bg-background p-3 rounded-xl shadow">
//       <div>
//         <Button
//           variant={"outline"}
//           className="py-2 rounded-none border-r-0 rounded-s-xl"
//         >
//           Automated Documents
//         </Button>
//         <Button variant={"outline"} className="py-2 rounded-none border-r-0">
//           Risk Management
//         </Button>
//         <Button
//           variant={"outline"}
//           className="py-2 rounded-none border-r rounded-r-xl"
//         >
//           Manual Documents
//         </Button>
//       </div>
//       <Button variant={"secondary"} className="flex gap-2 items-center py-1.5">
//         <Download className="w-[18px] text-purple-600" />
//         <span>Download All (By Category)</span>
//       </Button>
//     </div>
//   );
// };
