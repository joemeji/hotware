import React, { memo, useContext } from "react";
import useSWRInfinite from "swr/infinite";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { fetcher } from "@/utils/api.config";
import { ScrollArea } from "@/components/ui/scroll-area";
import { beginScrollDataPagerForInfiniteswr } from "@/components/pagination";
import LoadingMore from "@/components/LoadingMore";
import Image from "next/image";
import { TD, TH } from "@/components/items";
import { reportsItems } from "@/lib/azureUrls";

type Content = {
  scrollHeaderHeight?: number;
  search?: any;
};

const uri = (_shipping_id: any, params: any) => {
  let searchParams = new URLSearchParams(params);
  return `/api/shipping/${_shipping_id}/item/reports?${searchParams.toString()}`;
};

const Content = ({ scrollHeaderHeight, search }: Content) => {
  const shippingDetails: any = useContext(ShippingDetailsContext);

  const { data, isLoading, error, size, setSize, isValidating } =
    useSWRInfinite(
      (index) => {
        const params: any = {};

        params["page"] = String(index + 1);

        if (search) {
          params["page"] = 1;
          params["search"] = search;
        }

        let _uri = uri(shippingDetails?._shipping_id, params);

        return _uri;
      },
      fetcher,
      {
        revalidateAll: true,
      }
    );

  const _data: any = data ? [].concat(...data) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const onscrollend = () => {
    const currentPage = beginScrollDataPagerForInfiniteswr(_data);
    if (currentPage) {
      setSize(currentPage + 1);
    }
  };

  return (
    <ScrollArea
      viewPortStyle={{ height: `calc(100vh - ${scrollHeaderHeight}px)` }}
      onScrollEndViewPort={onscrollend}
      viewPortClassName="flex flex-col"
    >
      <table className="w-full">
        <thead>
          <tr>
            <TH className="ps-5">Item</TH>
            <TH>Description</TH>
            <TH>File</TH>
          </tr>
        </thead>
        <tbody>
          {_data &&
            Array.isArray(_data) &&
            _data.map((data: any) => {
              return (
                data &&
                Array.isArray(data.reports) &&
                data.reports.map((item: any, key: number) => (
                  <tr key={key}>
                    <TD className="ps-5">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">{item.item_name}</span>
                        {item.serial_number ? (
                          <span className="">{item.serial_number}</span>
                        ) : (
                          item.article_number && (
                            <span>{item.article_number}</span>
                          )
                        )}
                      </div>
                    </TD>
                    <TD>
                      <span className="font-medium">
                        {item.description_report}
                      </span>
                    </TD>
                    <TD>
                      <a
                        className="font-medium"
                        target="_blank"
                        href={`${reportsItems}/${item.file_report}`}
                      >
                        {item.file_report}
                      </a>
                    </TD>
                  </tr>
                ))
              );
            })}
        </tbody>
      </table>

      {Array.isArray(_data) &&
        _data.length === 1 &&
        _data[0].reports?.length === 0 && (
          <div className="flex justify-center">
            <Image
              src="/images/No data-rafiki.svg"
              width={400}
              height={400}
              alt="No Data to Shown"
            />
          </div>
        )}

      {isLoadingMore && (
        <div className="py-3">
          <LoadingMore />
        </div>
      )}
    </ScrollArea>
  );
};

export default memo(Content);
