import Combobox from "../ui/combobox";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { beginScrollDataPagerForInfiniteswr } from "../pagination";
import useSWRInfinite from "swr/infinite";

const ApiDocumentLanguageSelect = (props: ApiDocumentLanguageSelectProps) => {
  const { data: session }: any = useSession();
  const {
    value,
    onChangeValue,
    placeholder,
    error: formError,
    className,
    onChangeDocLang,
  } = props;
  const [search, setSearch] = useState("");

  const { data, isLoading, error, mutate, size, setSize, isValidating } =
    useSWRInfinite((index) => {
      let paramsObj: any = {};
      paramsObj["page"] = index + 1;
      paramsObj["search"] = search;
      let searchParams = new URLSearchParams(paramsObj);
      return [
        `/api/document/language/all?${searchParams}`,
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
        if (item && Array.isArray(item.languages)) {
          item.languages.forEach((item: any) => {
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
                      {item.document_language_name}
                    </span>
                  </div>
                </div>
              ),
              value: item.document_language_id,
            });
          });
        }
      });
    }
    return items;
  };

  // const { data, isLoading } = useSWR(
  //   session?.user?.access_token
  //     ? ["/api/document/language/all", session?.user?.access_token]
  //     : null,
  //   fetchApi,
  //   { revalidateOnFocus: false }
  // );

  // const contentData = () => {
  //   if (Array.isArray(data) && data.length > 0) {
  //     return data.map((item: any) => {
  //       return {
  //         value: item.document_language_id,
  //         text: (
  //           <div className="flex gap-2 items-center justify-between w-full">
  //             <span className="font-medium">{item.document_language_name}</span>
  //           </div>
  //         ),
  //       };
  //     });
  //   }
  //   return;
  // };

  const _onChangeValue = (value?: any) => {
    onChangeValue && onChangeValue(value);

    const docLang =
      Array.isArray(data) &&
      data.find((item: any) => item.document_language_id == value);

    onChangeDocLang && onChangeDocLang(docLang);
  };

  return (
    <div className="flex flex-col gap-1">
      <Combobox
        contents={contentData()}
        placeholder={placeholder}
        value={value}
        onChangeValue={_onChangeValue}
        isLoading={isLoading}
        className={cn(className, formError && formErrorClassNames)}
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

type ApiDocumentLanguageSelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
  className?: any;
  onChangeDocLang?: (docLang?: any) => void;
};

export default ApiDocumentLanguageSelect;
