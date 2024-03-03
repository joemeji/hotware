import Combobox from "../ui/combobox";
import useSWR from "swr";
import { fetcher } from "@/utils/api.config";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";
import useSWRInfinite from "swr/infinite";
import { beginScrollDataPagerForInfiniteswr } from "../pagination";
import { useState } from "react";

const ItemMainCategorySelect = (props: ItemMainCategorySelectProps) => {
  const { value, onChangeValue, placeholder, error: formError } = props;
  const [search, setSearch] = useState("");

  const { data, isLoading, error, mutate, size, setSize, isValidating } =
    useSWRInfinite((index) => {
      let paramsObj: any = {};
      paramsObj["page"] = index + 1;
      paramsObj["search"] = search;
      let searchParams = new URLSearchParams(paramsObj);
      return [`/api/item/main-category/all?${searchParams}`];
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
        if (item && Array.isArray(item.mains)) {
          item.mains.forEach((item: any) => {
            items.push({
              value: item.item_main_category_id,
              text: (
                <div className="flex gap-2 items-center justify-between w-full">
                  <span className="font-medium">
                    {item.item_main_category_name}
                  </span>
                </div>
              ),
            });
          });
        }
      });
    }
    return items;
  };

  // const { data, isLoading } = useSWR("/api/item/main-category/all", fetcher, {
  //   revalidateOnFocus: false,
  // });

  // const contentData = () => {
  //   if (Array.isArray(data) && data.length > 0) {
  //     return data.map((item: any) => {
  //       return {
  //         value: item.item_main_category_id,
  //         text: (
  //           <div className="flex gap-2 items-center justify-between w-full">
  //             <span className="font-medium">
  //               {item.item_main_category_name}
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

type ItemMainCategorySelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
};

export default ItemMainCategorySelect;
