import React, { memo, useContext, useEffect, useState } from "react";
import AvatarProfile from "@/components/AvatarProfile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useSWRInfinite from "swr/infinite";
import { baseUrl, fetcher } from "@/utils/api.config";
import dayjs from "dayjs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { beginScrollDataPagerForInfiniteswr } from "@/components/pagination";
import LoadingMore from "@/components/LoadingMore";
import Image from "next/image";

type ActivityLogs = {
  _order_confirmation_id: string | undefined;
  scrollHeaderHeight?: number;
  filter?: any;
};

const historyUri = (_order_confirmation_id: any, filter: any = {}) => {
  if (filter.to || filter.from || filter.search) {
    if (filter.page) delete filter.page;
  }
  let searchParams = new URLSearchParams(filter);
  return `/api/document_history/order/${_order_confirmation_id}?${searchParams}`;
};

const ActivityLogs = ({
  _order_confirmation_id,
  scrollHeaderHeight,
  filter: _filter,
}: ActivityLogs) => {
  const [filter, setFilter] = useState<any>(null);

  const { data, isLoading, error, size, setSize, isValidating } =
    useSWRInfinite(
      (index) => {
        let paramsObj: any = {};

        paramsObj["page"] = index + 1;

        if (filter) paramsObj = filter;

        let uri = historyUri(_order_confirmation_id, paramsObj);

        return uri;
      },
      fetcher,
      {
        revalidateAll: true,
      }
    );

  const _data: any = data ? [].concat(...data) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const listData = (list: any[]) => {
    const groups = list.reduce((groups, log) => {
      const date = dayjs(log.document_history_date).format("YYYY-MM-DD");
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(log);
      return groups;
    }, {});

    const groupArrays = Object.keys(groups).map((date) => {
      return {
        date,
        logs: groups[date],
      };
    });

    return groupArrays;
  };

  const onscrollend = () => {
    const currentPage = beginScrollDataPagerForInfiniteswr(_data);
    if (currentPage) {
      setSize(currentPage + 1);
    }
  };

  useEffect(() => {
    if (_filter) {
      setFilter(_filter);
    }
  }, [_filter]);

  const statusText = (log: any) => {
    if (
      typeof log.document_history_status === "string" &&
      (log.document_history_status.includes("edit") ||
        log.document_history_status.includes("update"))
    ) {
      return (
        <>
          <span className="capitalize">{log.document_history_status}</span> of{" "}
          <span className="font-medium">
            <span
              dangerouslySetInnerHTML={{
                __html: log.document_history_old_value,
              }}
            />
          </span>{" "}
          to{" "}
          <span className="font-medium">
            <span
              dangerouslySetInnerHTML={{
                __html: log.document_history_new_value,
              }}
            />
          </span>
        </>
      );
    }

    if (
      typeof log.document_history_status === "string" &&
      log.document_history_status.includes("add")
    ) {
      return (
        <>
          <span className="capitalize">{log.document_history_status}</span>{" "}
          <span className="font-medium">
            <span
              dangerouslySetInnerHTML={{
                __html: log.document_history_new_value,
              }}
            />
          </span>
        </>
      );
    }

    if (
      typeof log.document_history_status === "string" &&
      (log.document_history_status.includes("delete") ||
        log.document_history_status.includes("remove"))
    ) {
      return (
        <>
          <span className="capitalize">{log.document_history_status}</span>{" "}
          <span className="font-medium">{log.document_history_old_value}</span>
        </>
      );
    }

    return (
      <>
        <span className="capitalize">{log.document_history_status}</span>
      </>
    );
  };

  const customText = (log: any) => {
    let text = log.custom_edited_by;

    if (typeof text === "string") {
      text = text.replace("{new_value}", log.document_history_new_value);
      text = text.replace("{old_value}", log.document_history_old_value);
    }

    return <span>{text}</span>;
  };

  return (
    <ScrollArea
      viewPortStyle={{ height: `calc(100vh - ${scrollHeaderHeight}px)` }}
      onScrollEndViewPort={onscrollend}
      viewPortClassName="flex flex-col"
    >
      <div className="py-5 px-5 pb-0 ps-14">
        {_data &&
          Array.isArray(_data) &&
          _data.map((data: any) => {
            return (
              data &&
              Array.isArray(data.list) &&
              listData(data.list).map((item: any, key) => (
                <div
                  key={key}
                  className="border-l-4 border-dotted border-stone-200 relative"
                >
                  <span
                    className="bg-red-500 text-white font-medium py-1 px-2 text-[12px] rounded-xl"
                    ref={(el) => {
                      if (el)
                        el.style.marginLeft = -(el?.offsetWidth / 2) + "px";
                    }}
                  >
                    {dayjs(item.date).format("MMM DD, YYYY")}
                  </span>

                  <div className="py-10 flex gap-4 flex-col">
                    {item &&
                      item.logs.map((log: any, key: number) => (
                        <div className="flex items-center group" key={key}>
                          <div className="dot-large bg-white w-[15px] h-[15px] -ms-[9px] border-2 m-[4px] rounded-full border-stone-300" />
                          <div className="dots w-[50px] border-dotted border-b-4 border-b-stone-200" />
                          <div className="content w-[calc(100%-50px-7.5px)] py-2 px-1 bg-white rounded-xl relative group-hover:bg-stone-200">
                            <div className="flex gap-2 items-start">
                              <TooltipProvider delayDuration={400}>
                                <Tooltip>
                                  <TooltipTrigger>
                                    <AvatarProfile
                                      firstname={log.user_firstname}
                                      lastname={log.user_lastname}
                                      photo={
                                        baseUrl +
                                        "/users/thumbnail/" +
                                        log.user_photo
                                      }
                                      avatarClassName="w-10 h-10"
                                      avatarColor={log.avatar_color}
                                      avatarFallbackClassName="font-medium text-white text-xs"
                                    />
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>
                                      {log.user_firstname} {log.user_lastname}
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>

                              <span className="flex flex-col gap-1">
                                <span className="text-sm text-[12px] text-stone-500">
                                  {dayjs(log.document_history_date).format(
                                    "hh:mm a"
                                  )}
                                </span>
                                <span>
                                  {log.custom_edited_by
                                    ? customText(log)
                                    : statusText(log)}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))
            );
          })}
      </div>

      {Array.isArray(_data) &&
        _data?.length === 1 &&
        _data[0]?.list?.length === 0 && (
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

export default memo(ActivityLogs);
