import Combobox from "../ui/combobox";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { beginScrollDataPagerForInfiniteswr } from "../pagination";
import useSWRInfinite from "swr/infinite";
import { useContext, useState } from "react";
import { AccessTokenContext } from "@/context/access-token-context";

const CmsIndustrySelect = (props: CmsIndustrySelectProps) => {
  const access_token = useContext(AccessTokenContext);
  const { data: session }: any = useSession();
  const { value, onChangeValue, placeholder, error: formError } = props;
  const [search, setSearch] = useState("");

  const { data, isLoading, error, mutate, size, setSize, isValidating } =
    useSWRInfinite((index) => {
      let paramsObj: any = {};
      paramsObj["page"] = index + 1;
      paramsObj["search"] = search;
      let searchParams = new URLSearchParams(paramsObj);
      return [`/api/cms/industries?${searchParams}`, session.user.access_token];
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
        if (item && Array.isArray(item.industries)) {
          item.industries.forEach((item: any) => {
            items.push({
              text: (
                <div className="flex gap-2 items-center justify-between w-full">
                  <span className="font-medium">{item.cms_industry_name}</span>
                </div>
              ),
              value: item.cms_industry_id,
            });
          });
        }
      });
    }
    return items;
  };

  // const { data, isLoading } = useSWR(
  //   session?.user?.access_token
  //     ? ["/api/cms/industries", session?.user?.access_token]
  //     : null,
  //   fetchApi,
  //   { revalidateOnFocus: false }
  // );

  // const contentData = () => {
  //   if (Array.isArray(data) && data.length > 0) {
  //     return data.map((item: any) => {
  //       return {
  //         value: item.cms_industry_id,
  //         text: (
  //           <div className="flex gap-2 items-center justify-between w-full">
  //             <span className="font-medium">{item.cms_industry_name}</span>
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

type CmsIndustrySelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
};

export default CmsIndustrySelect;
