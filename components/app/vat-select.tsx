import Combobox from "../ui/combobox";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import useSWRInfinite from "swr/infinite";
import { beginScrollDataPagerForInfiniteswr } from "../pagination";

const VatSelect = (props: VatSelectProps) => {
  const { data: session }: any = useSession();
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [search, setSearch] = useState("");
  const {
    value,
    onChangeValue,
    placeholder,
    error: formError,
    modal = false,
    disabled = false,
    byCompany = false,
    allowNoVat = true,
  } = props;
  
  const { data, isLoading, error, mutate, size, setSize, isValidating } = 
  useSWRInfinite((index) => {
    let paramsObj: any = {};
    paramsObj["page"] = index + 1;
    paramsObj["search"] = search;
    let searchParams = new URLSearchParams(paramsObj);
    return [session?.user?.access_token && `/api/vats${byCompany ? "/company" : ""}?${searchParams}`, session?.user?.access_token];
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
      const list = allowNoVat
        ? [{ vat_id: "0", vat_description: "No VAT" }, ..._data]
        : _data;

      list.forEach((item: any) => {
        if (item && Array.isArray(item.vat)) {
          item.vat.forEach((item: any) => {
            items.push({
              text: (
                <div
                  className={cn(
                    "flex justify-between py-1",
                    "items-start hover:bg-stone-100 cursor-pointer"
                  )}
                >
                  <div className="flex gap-2 items-center justify-between w-full">
                    <span className="font-medium">
                      {item.vat_description}{" "}
                      {item.vat_percentage ? `(${item.vat_percentage}%)` : ""}{" "}
                    </span>
                  </div>
                </div>
              ),
              value: item.vat_id,
            });
          });
        }
      });
    }
    return items;
  };

  if (disabled) {
    return contentData()?.find((_data: any) => _data.value == value)?.text || "";
  }

  return (
    <div className="flex flex-col gap-1">
      <Combobox
        modal={modal}
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
      {formError && <ErrorFormMessage message={formError.message} />}
    </div>
  );
};

type VatSelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
  modal?: boolean;
  disabled?: boolean;
  byCompany?: boolean;
  allowNoVat?: boolean;
};

export default VatSelect;
