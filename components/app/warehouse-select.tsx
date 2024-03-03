import Combobox from "../ui/combobox";
import useSWR, { preload } from "swr";
import { fetcher } from "@/utils/api.config";
import ErrorFormMessage from "./error-form-message";
import { formErrorClassNames } from "@/utils/app";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import useSWRInfinite from "swr/infinite";
import { beginScrollDataPagerForInfiniteswr } from "../pagination";

preload('/api/warehouse', fetcher);

const WarehouseSelect = (props: WarehouseSelectProps) => {
  const { value, onChangeValue, placeholder, error: formError } = props;
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading, error, mutate, size, setSize, isValidating } = useSWRInfinite((index) => {
    let paramsObj: any = {};
    paramsObj["page"] = index + 1;
    paramsObj["search"] = search;
    let searchParams = new URLSearchParams(paramsObj);
    return `/api/warehouse?${searchParams}`;
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
        if (item && Array.isArray(item.warehouse)) {
          item.warehouse.forEach((item: any) => {
            items.push({
              text: (
                <div
                  className={cn(
                    "flex justify-between py-1",
                    "items-start hover:bg-stone-100 cursor-pointer"
                  )}
                >
                  <div className="flex gap-0 flex-col">
                    <span className="font-medium">{item.warehouse_name}</span>
                    <span className=" opacity-80">{item.warehouse_location}</span>
                  </div>
                </div>
              ),
              value: item.warehouse_id,
            });
          });
        }
      });
    }
    return items;
  };

  return (
    <div className="flex flex-col gap-1">
      <Combobox 
        contents={contentData()}
        placeholder={placeholder}
        value={value}
        onScrollEnd={onscrollend}
        onChangeValue={onChangeValue}
        className={cn(formError && formErrorClassNames)}
        isLoadingMore={isLoadingMore}
        onOpenChange={open => setIsOpenPopover(open)}
        onSearch={(value: any) => {
          setSearch(value);
        }}
      />
      {formError && (
        <ErrorFormMessage 
          message={formError.message} 
        />
      )}
    </div>
  );
};

type WarehouseSelectProps = {
  value?: any
  onChangeValue?: (value?: any) => void
  placeholder?: any
  error?: any
}

export default WarehouseSelect;