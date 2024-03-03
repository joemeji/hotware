import Combobox from "@/components/ui/combobox";
import { fetcher } from "@/utils/api.config";
import useSWR from "swr";
import React, { useState } from "react";
import useSWRInfinite from "swr/infinite";
import { beginScrollDataPagerForInfiniteswr } from "../pagination";
import { cn } from "@/lib/utils";

export const PurchaseOrderApproverSelect = (props: PurchaseOrderApproverSelect) => {
  const { onChangeValue, value, multiple, setValues: setValue } = props;
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading, error, mutate, size, setSize, isValidating } = useSWRInfinite((index) => {
    let paramsObj: any = {};
    paramsObj["page"] = index + 1;
    paramsObj["search"] = search;
    let searchParams = new URLSearchParams(paramsObj);
    return `/api/user/po_approvers?${searchParams}`;
  }, fetcher);
  
  const _data: any = data ? [].concat(...data) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const onscrollend = () => {
    const currentPage = beginScrollDataPagerForInfiniteswr(_data, size);

    if (currentPage) {
      setSize(currentPage + 1);
    }
  };

  const contentData = () => {
    const items: any = [];
    if (_data && Array.isArray(_data)) {
      _data.forEach((item: any) => {
        if (item && Array.isArray(item.approver)) {
          item.approver.forEach((item: any) => {
            items.push({
              text: (
                <div
                  className={cn(
                    "flex justify-between py-1",
                    "items-start hover:bg-stone-100 cursor-pointer"
                  )}
                >
                  <div className="flex gap-2 items-center justify-between w-full">
                    <span className="font-medium">{item?.user_firstname + " " + item?.user_lastname}</span>
                  </div>
                </div>
              ),
              label: item?.user_firstname + " " + item?.user_lastname,
              value: item?.user_id,
            });
          });
        }
      });
    }
    return items;
  };

  return (
    <div className='flex flex-col gap-2'>
      <Combobox
        isLoading={isLoading}
        value={value}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className='h-10'
        onScrollEnd={onscrollend}
        isLoadingMore={isLoadingMore}
        onOpenChange={open => setIsOpenPopover(open)}
        onSearch={(value: any) => {
          setSearch(value);
        }}
      />
    </div>
  );
};

type PurchaseOrderApproverSelect = {
  onChangeValue?: (value?: any) => void;
  value?: any;
  multiple?: boolean;
  defaultValue?: any;
  setValues?: any;
};
