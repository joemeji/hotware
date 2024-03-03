import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import Combobox from "../ui/combobox";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import useSWRInfinite from "swr/infinite";
import { beginScrollDataPagerForInfiniteswr } from "../pagination";

const CountrySelect = (props: CountrySelectProps) => {
  const { data: session }: any = useSession();
  const { value, onChangeValue, placeholder, error: formError } = props;
  const [search, setSearch] = useState("");

  const { data, isLoading, error, mutate, size, setSize, isValidating } =
    useSWRInfinite((index) => {
      let paramsObj: any = {};
      paramsObj["page"] = index + 1;
      paramsObj["search"] = search;
      let searchParams = new URLSearchParams(paramsObj);
      return [`/api/country/all?${searchParams}`, session?.user?.access_token];
    }, fetchApi);

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
        if (item && Array.isArray(item.countries)) {
          item.countries.forEach((item: any) => {
            items.push({
              text: (
                <div
                  className={cn(
                    "flex justify-between py-1",
                    "items-start hover:bg-stone-100 cursor-pointer"
                  )}
                >
                  <div className="flex gap-0 flex-col">
                    <span className="font-medium">{item.country_name}</span>
                  </div>
                </div>
              ),
              value: item.country_id,
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
        isLoadingMore={isLoadingMore}
        className={cn(formError && formErrorClassNames)}
        onSearch={(value: any) => {
          setSearch(value);
        }}
      />
      {formError && <ErrorFormMessage message={formError.message} />}
    </div>
  );
};

type CountrySelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
};

export default CountrySelect;
