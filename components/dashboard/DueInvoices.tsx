import { useContext, useState } from "react";
import { AccessTokenContext } from "@/context/access-token-context";
import { ScrollArea } from "../ui/scroll-area";
import ListView from "../projects/invoices/ListView";

export default function DueInvoices() {
  const access_token = useContext(AccessTokenContext);

  return (
    <div className="rounded-xl shadow overflow-hidden w-full">
      <ScrollArea viewPortClassName="max-h-[700px] min-h-[400px] w-full">
        <ListView
          access_token={access_token}
          dashboard={true}
          onProject={true}
        />
      </ScrollArea>
    </div>
  );
}
