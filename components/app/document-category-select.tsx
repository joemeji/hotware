import Combobox from "../ui/combobox";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useContext, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { beginScrollDataPagerForInfiniteswr } from "../pagination";
import { AccessTokenContext } from "@/context/access-token-context";

const DocumentCategorySelect = (props: DocumentCategorySelectProps) => {
  const access_token = useContext(AccessTokenContext);
  const { data: session }: any = useSession();
  const {
    value,
    onChangeValue,
    placeholder,
    error: formError,
    document_type,
    className,
    onChangeDocCategory,
  } = props;

  const [search, setSearch] = useState("");

  const { data, isLoading, error, mutate, size, setSize, isValidating } =
    useSWRInfinite((index) => {
      let paramsObj: any = {};
      paramsObj["page"] = index + 1;
      paramsObj["search"] = search;
      paramsObj["document_type"] = document_type ? document_type : "";
      let searchParams = new URLSearchParams(paramsObj);
      return [
        `/api/document/categories?${searchParams}`,
        access_token ? access_token : session?.user?.access_token,
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
        if (item && Array.isArray(item.categories)) {
          item.categories.forEach((item: any) => {
            items.push({
              value: item.document_category_id,
              text: (
                <div className="flex gap-2 items-center justify-between w-full">
                  <span className="font-medium">
                    {item.document_category_name}
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

  // const { data, isLoading } = useSWR(
  //   session?.user?.access_token
  //     ? [
  //         `/api/document/categories${
  //           document_type ? "?document_type=" + document_type : ""
  //         }`,
  //         session?.user?.access_token,
  //       ]
  //     : null,
  //   fetchApi,
  //   { revalidateOnFocus: false }
  // );

  // const contentData = () => {
  //   if (Array.isArray(data) && data.length > 0) {
  //     return data.map((item: any) => {
  //       return {
  //         value: item.document_category_id,
  //         text: (
  //           <div className="flex gap-2 items-center justify-between w-full">
  //             <span className="font-medium">{item.document_category_name}</span>
  //           </div>
  //         ),
  //       };
  //     });
  //   }
  //   return;
  // };

  const _onChangeValue = (value?: any) => {
    onChangeValue && onChangeValue(value);

    const docCategory =
      Array.isArray(data) &&
      data.find((item: any) => item.document_category_id == value);

    onChangeDocCategory && onChangeDocCategory(docCategory);
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

type DocumentCategorySelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
  document_type?: "company" | "employee" | "equipment";
  className?: any;
  onChangeDocCategory?: (docCategory?: any) => void;
};

export default DocumentCategorySelect;
