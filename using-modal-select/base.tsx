import SearchInput from "@/components/app/search-input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import useAccessToken from "@/hooks/useAccessToken";
import { fetchApi } from "@/utils/api.config";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import React from "react";
import useSWR from "swr";

type BaseType = {
  onOpenChange?: (open?: boolean) => void;
  open?: boolean;
  children?: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
  minHeight?: string;
};

const Base = ({
  onOpenChange,
  open,
  children,
  maxWidth = "500px",
  maxHeight = "99vh",
  minHeight = "500px",
}: BaseType) => {
  const access_token = useAccessToken();

  const payload: any = {};
  let searchParams = new URLSearchParams(payload);

  const { data, isLoading, error, mutate } = useSWR(
    [open && `/api/select/cms?${searchParams.toString()}`, access_token],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  console.log(data);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        onOpenChange && onOpenChange(open);
      }}
    >
      <DialogContent
        className="max-w-[600px] p-0 overflow-auto gap-0"
        style={{ maxWidth, minHeight }}
      >
        <ScrollArea
          viewPortStyle={{ maxHeight, minHeight }}
          className="relative"
        >
          <DialogHeader className=" sticky top-0 bg-background z-10">
            <div className="flex flex-col">
              <div className="py-2 px-3 flex justify-between items-center">
                <DialogTitle>Select CMS</DialogTitle>
                <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
                  <X />
                </DialogPrimitive.Close>
              </div>
              <div className="px-3 pb-3">
                <SearchInput width={null} />
              </div>
            </div>
          </DialogHeader>

          <div className="flex flex-col gap-1 px-3">
            {Array.isArray(data?.list) &&
              data.list.map((item: any, key: number) => (
                <div key={key} className="bg-red-100 py-2 rounded-xl px-2">
                  {item.text}
                </div>
              ))}
          </div>

          <DialogFooter className="p-3 absolute bottom-0 bg-background z-10 w-full">
            <Button
              variant={"ghost"}
              type="button"
              onClick={() => onOpenChange && onOpenChange(false)}
            >
              Close
            </Button>
            <Button type="button">Select</Button>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(Base);
