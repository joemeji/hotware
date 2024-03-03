import Combobox from "@/components/ui/combobox";
import { fetcher } from "@/utils/api.config";
import ComboboxMultiple from "@/components/ui/combobox-multiple";
import ErrorFormMessage from "./error-form-message";
import React, { useState } from "react";
import useSWRInfinite from "swr/infinite";
import { beginScrollDataPagerForInfiniteswr } from "../pagination";
import { cn } from "@/lib/utils";

export const TechnicianSelect = (props: TechnicianSelect) => {
  const {
    onChangeValue,
    value,
    multiple,
    setValues: setValue,
    error: formError,
  } = props;
  const [search, setSearch] = useState("");
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error, mutate, size, setSize, isValidating } = useSWRInfinite((index) => {
    let paramsObj: any = {};
    paramsObj["page"] = index + 1;
    paramsObj["search"] = search;
    let searchParams = new URLSearchParams(paramsObj);
    return `/api/user/technicians?${searchParams}`;
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
        if (item && Array.isArray(item.technician)) {
          item.technician.forEach((item: any) => {
            items.push({
              text: (
                <div
                  className={cn(
                    "flex justify-between py-1",
                    "items-start hover:bg-stone-100 cursor-pointer"
                  )}
                >
                  <div className="flex gap-0 flex-col">
                    <span className="font-medium">{item?.user_firstname + " " + item?.user_lastname}</span>
                  </div>
                </div>
              ),
              label: item?.user_firstname + " " + item?.user_lastname,
              value: item?.id,
            });
          });
        }
      });
    }
    return items;
  };

  if (multiple) {
    return (
      <div className="flex flex-col gap-2">
        <ComboboxMultiple
          contents={contentData()}
          value={value}
          onChangeValue={onChangeValue}
          isLoading={isLoading}
          className="h-10"
          onScrollEnd={onscrollend}
          isLoadingMore={isLoadingMore}
          onOpenChange={open => setIsOpenPopover(open)}
          onSearch={(value: any) => {
            setSearch(value);
          }}
        />
        {formError && <ErrorFormMessage message={formError.message} />}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <Combobox
        isLoading={isLoading}
        value={value}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className="h-10"
        onScrollEnd={onscrollend}
        isLoadingMore={isLoadingMore}
        onOpenChange={open => setIsOpenPopover(open)}
        onSearch={(value: any) => {
          setSearch(value);
        }}
      />
      {formError && <ErrorFormMessage message={formError.message} />}
    </div>
  );
};

type TechnicianSelect = {
  onChangeValue?: (value?: any) => void;
  value?: any;
  multiple?: boolean;
  defaultValue?: any;
  setValues?: any;
  error?: any;
};
