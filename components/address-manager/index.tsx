import { memo, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AddNewContact } from "./main-page/AddNewContact";
import { Buttons } from "./main-page/Buttons";
import List from "./main-page/List";

const AddressManager = () => {
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
            <AddNewContact />
            <Buttons />
          </div>
          <List />
        </ScrollArea>
      </div>
    </>
  );
};

export default memo(AddressManager);
