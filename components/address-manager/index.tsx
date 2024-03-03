import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddNewContact } from "./main-page/AddNewContact";
import { Buttons } from "./main-page/Buttons";
import List from "./main-page/List";

const AddressManager = () => {
  const [search, setSearch] = useState("");
  const [success, setSuccess] = useState(false);
  return (
    <>
      <div className="w-full h-full">
        <ScrollArea
          className="flex flex-col"
          viewPortClassName="min-h-[400px] rounded-app bg-white"
        >
          <div
            className={cn(
              "flex w-full flex-col",
              "backdrop-blur-sm bg-white/90 rounded-t-app"
            )}
          >
            <AddNewContact onSuccess={(value: any) => setSuccess(value)} />
            <Buttons
              onSearch={(value: any) => setSearch(value)}
              success={success}
            />
          </div>
          <List search={search} success={success} />
        </ScrollArea>
      </div>
    </>
  );
};

export default memo(AddressManager);
