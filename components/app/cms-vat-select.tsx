import Combobox from "../ui/combobox";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { useState, useEffect, useContext } from "react";
import { useSession } from "next-auth/react";
import useSWRInfinite from "swr/infinite";
import { beginScrollDataPagerForInfiniteswr } from "../pagination";
import { cn } from "@/lib/utils";
import { AccessTokenContext } from "@/context/access-token-context";

const CmsVatSelect = (props: CmsVatSelectProps) => {
  const access_token = useContext(AccessTokenContext);
  const { data: session }: any = useSession();
  const { value, onChangeValue, placeholder, cms_id } = props;
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [cmsId, setCmsId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setCmsId(cms_id);
  }, [cms_id]);

  const { data, isLoading, error, mutate, size, setSize, isValidating } =
    useSWRInfinite((index) => {
      let paramsObj: any = {};
      paramsObj["page"] = index + 1;
      paramsObj["search"] = search;
      let searchParams = new URLSearchParams(paramsObj);
      return [
        cmsId ? `/api/cms/cms_vats/${cmsId}?${searchParams}` : null,
        access_token,
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
        if (item && Array.isArray(item.vats)) {
          item.vats.forEach((vat: any) => {
            items.push({
              text: (
                <div className="flex gap-2 items-start">
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {vat.cms_vat_description} ({vat.cms_vat_code})
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

  // const { data, isLoading } = useSWR(
  //   session?.user?.access_token
  //     ? [`/api/cms/cms_vats/${cmsId}`, session?.user?.access_token]
  //     : null,
  //   fetchApi
  // );

  // const contentData = () => {
  //   if (Array.isArray(data) && data.length > 0) {
  //     return data.map((vat: any) => {
  //       return {
  //         value: vat.cms_vat_id,
  //         text: (
  //           <div className="flex gap-2 items-start">
  //             <div className="flex flex-col">
  //               <span className="font-medium">
  //                 {vat.cms_vat_description} ({vat.cms_vat_code})
  //               </span>
  //             </div>
  //           </div>
  //         ),
  //       };
  //     });
  //   }
  //   return;
  // };

  return (
    <Combobox
      contents={contentData()}
      placeholder={placeholder}
      value={value}
      onChangeValue={onChangeValue}
      onOpenChange={(open) => setIsOpenPopover(open)}
      isLoadingMore={isLoadingMore}
      onScrollEnd={onscrollend}
      onSearch={(value: any) => {
        setSearch(value);
      }}
    />
  );
};

type CmsVatSelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  cms_id?: any;
};

export default CmsVatSelect;
