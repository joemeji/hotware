import Combobox from "../ui/combobox";
import useSWR, { preload } from "swr";
import { fetcher } from "@/utils/api.config";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { beginScrollDataPagerForInfiniteswr } from "../pagination";
import useSWRInfinite from "swr/infinite";

preload("/api/currency", fetcher);

const CurrencySelect = (props: CurrencySelectProps) => {
  const { value, onChangeValue, placeholder, error: formError } = props;
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading, error, mutate, size, setSize, isValidating } =
    useSWRInfinite((index) => {
      let paramsObj: any = {};
      paramsObj["page"] = index + 1;
      paramsObj["search"] = search;
      let searchParams = new URLSearchParams(paramsObj);
      return [`/api/currency?${searchParams}`];
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
        if (item && Array.isArray(item.currencies)) {
          item.currencies.forEach((item: any) => {
            items.push({
              text: (
                <div className="flex gap-2 items-center justify-between w-full">
                  <span className="font-medium">
                    {item.currency_name} ({item.currency_sign})
                  </span>
                </div>
              ),
              value: item.currency_id,
            });
          });
        }
      });
    }
    return items;
  };

  // const { data, isLoading, error, mutate } = useSWR("/api/currency", fetcher);

  // const contentData = () => {
  //   if (Array.isArray(data) && data.length > 0) {
  //     return data.map((item: any) => {
  //       return {
  //         value: item.currency_id,
  //         text: (
  //           <div className="flex gap-2 items-center justify-between w-full">
  //             <span className="font-medium">
  //               {item.currency_name} ({item.currency_sign})
  //             </span>
  //           </div>
  //         ),
  //       };
  //     });
  //   }
  //   return;
  // };

  return (
    <div className="flex flex-col gap-1">
      <Combobox
        contents={contentData()}
        placeholder={placeholder}
        value={value}
        onChangeValue={onChangeValue}
        isLoading={isLoading}
        className={cn(formError && formErrorClassNames)}
        onOpenChange={(open) => setIsOpenPopover(open)}
        isLoadingMore={isLoadingMore}
        onScrollEnd={onscrollend}
        onSearch={(value: any) => {
          setSearch(value);
        }}
      />
      {formError && <ErrorFormMessage message={formError.message} />}
    </div>
  );
};

type CurrencySelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
};

export default CurrencySelect;
