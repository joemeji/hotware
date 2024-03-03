import Combobox from "../ui/combobox";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useState } from "react";
import useSWRInfinite from "swr/infinite";
import { beginScrollDataPagerForInfiniteswr } from "../pagination";

const AccountTitleSelect = (props: AccountTitleSelectProps) => {
  const { data: session }: any = useSession();
  const {
    value,
    onChangeValue,
    placeholder,
    error: formError,
    modal = false,
  } = props;
  const [search, setSearch] = useState("");

  const { data, isLoading, error, mutate, size, setSize, isValidating } =
    useSWRInfinite((index) => {
      let paramsObj: any = {};
      paramsObj["page"] = index + 1;
      paramsObj["search"] = search;
      let searchParams = new URLSearchParams(paramsObj);
      return [
        `/api/account_titles?${searchParams}`,
        session?.user?.access_token,
      ];
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
        if (item && Array.isArray(item.titles)) {
          item.titles.forEach((item: any) => {
            items.push({
              text: (
                <div
                  className={cn(
                    "flex justify-between py-1",
                    "items-start hover:bg-stone-100 cursor-pointer"
                  )}
                >
                  <div className="flex gap-0 flex-col">
                    <span className="font-medium">
                      {item.account_title_name}
                    </span>
                  </div>
                </div>
              ),
              value: item.account_title_id,
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
        modal={modal}
        contents={contentData()}
        placeholder={placeholder}
        value={value}
        onChangeValue={onChangeValue}
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

type AccountTitleSelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
  modal?: boolean;
};

export default AccountTitleSelect;
