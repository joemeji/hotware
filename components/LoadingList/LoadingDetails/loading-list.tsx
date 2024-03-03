import MoreOption from "@/components/MoreOption";
import React, { memo, useEffect, useState } from "react";
import { baseUrl, fetchApi, fetcher } from "@/utils/api.config";
import { ItemMenu, loadingListMenu } from "..";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AvatarProfile from "@/components/AvatarProfile";
import EditLoadingListDetailsModal from "../modals/EditLoadingListDetailsModal";
import { DeleteLoadingListModal } from "../modals/DeleteLoadingListModal";
import useSWR from "swr";
import { Search, View, X } from "lucide-react";
import { useRouter } from "next/router";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AddNewLoadingListModal } from "../modals/AddNewLoadingListModal";
import useSWRInfinite from "swr/infinite";
import LoadingMore from "@/components/LoadingMore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { beginScrollDataPagerForInfiniteswr } from "@/components/pagination";
import LoadingDetailsModal from "../modals/LoadingDetailsModal";
import SearchInput from "@/components/app/search-input";

type LoadingListProps = {
  onClickItem?: (loadingDetails: any) => void;
  access_token?: any;
  onSuccess?: any;
};

const LoadingList = ({
  onClickItem,
  access_token,
  onSuccess,
}: LoadingListProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const [editLoadingListModal, setEditLoadingListModal] = useState(false);
  const [deleteLoadingListModal, setDeleteLoadingListModal] = useState(false);
  const [viewLoadingDetailsModal, setViewLoadingDetailsModal] = useState(false);
  const [addNewLoadingListModal, setNewLoadingListModal] = useState(false);

  const [loadingID, setLoadingID] = useState(null);
  const [_loading, set_loading] = useState(null);

  const { data, isLoading, error, mutate, size, setSize, isValidating } =
    useSWRInfinite((index) => {
      let paramsObj: any = {};
      paramsObj["page"] = index + 1;
      paramsObj["search"] = search;
      let searchParams = new URLSearchParams(paramsObj);
      return [`/api/loading-list/lists?${searchParams}`, access_token];
    }, fetchApi);

  // const { data, isLoading, error, mutate, size, setSize } = useSWRInfinite(
  //   [`/api/loading-list/lists?search=${search}`, access_token],
  //   fetchApi,
  //   {
  //     revalidateOnFocus: false,
  //     revalidateIfStale: false,
  //   }
  // );

  const _data: any = data ? [].concat(...data) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const handleEventLoadingList = (actionType: any, loading: any) => {
    let _loadingID = loading.loading_id;

    if (actionType == "edit") {
      setEditLoadingListModal(true);
      setLoadingID(_loadingID);
    } else if (actionType == "delete") {
      setDeleteLoadingListModal(true);
      setLoadingID(_loadingID);
    } else if (actionType == "details") {
      setViewLoadingDetailsModal(true);
      set_loading(loading);
    }
  };

  const onscrollend = () => {
    const currentPage = beginScrollDataPagerForInfiniteswr(_data);
    if (currentPage) {
      setSize(currentPage + 1);
    }
  };

  return (
    <>
      {addNewLoadingListModal && (
        <AddNewLoadingListModal
          open={addNewLoadingListModal}
          onOpenChange={(open: any) => setNewLoadingListModal(open)}
          onSuccess={() => mutate(data)}
        />
      )}
      {editLoadingListModal && (
        <EditLoadingListDetailsModal
          open={editLoadingListModal}
          onOpenChange={(open: any) => setEditLoadingListModal(open)}
          loadingId={loadingID}
        />
      )}
      {deleteLoadingListModal && (
        <DeleteLoadingListModal
          open={deleteLoadingListModal}
          onOpenChange={(open: any) => setDeleteLoadingListModal(open)}
          loadingID={loadingID}
        />
      )}
      {viewLoadingDetailsModal && (
        <LoadingDetailsModal
          open={viewLoadingDetailsModal}
          onOpenChange={(open: any) => setViewLoadingDetailsModal(open)}
          loading={_loading}
        />
      )}
      <ScrollArea
        viewPortClassName="min-h-[400px] max-h-[88vh]"
        onScrollEndViewPort={onscrollend}
      >
        <div className="top-0 sticky z-10 inset-0 backdrop-blur-md p-3">
          <p className="font-medium text-lg mb-2">Loading Lists</p>
          <SearchInput
            onChange={(e: any) => setSearch(e.target.value)}
            value={search}
            delay={500}
            width={370}
          />
        </div>
        <div className="flex flex-col gap-2 p-2">
          {Array.isArray(_data) &&
            _data.map((arr: any, arrKey: number) =>
              arr.list.map((loading: any, loadingKey: number) => (
                <div
                  className="w-full rounded-xl px-4 py-2 flex justify-between justify-items-center bg-stone-100/60 hover:bg-stone-100 hover:cursor-pointer relative"
                  onClick={() => {
                    onClickItem && onClickItem(loading);
                  }}
                  key={`arr_${arrKey}_loading_${loadingKey}`}
                >
                  <div className="flex flex-col justify-self-start gap-3 w-full">
                    <div className="flex flex-col gap-1">
                      <p className="font-medium text-base">
                        {loading.loading_description}
                      </p>
                      <p>{loading.loading_work}</p>
                    </div>
                    <div className="border rounded-xl">
                      <table className="w-full">
                        <tbody>
                          <tr>
                            <td className="border-r p-2 border-stone-200 w-[100px]">
                              <div className="flex flex-col gap-1 items-center">
                                <span className="text-[11px] opacity-70">
                                  Added By
                                </span>
                                <div className="flex flex-col gap-2 items-center">
                                  <TooltipProvider delayDuration={400}>
                                    <Tooltip>
                                      <TooltipTrigger>
                                        <AvatarProfile
                                          firstname={loading.user_firstname}
                                          lastname={loading.user_lastname}
                                          photo={`${baseUrl}/users/thumbnail/${loading.user_photo}`}
                                          avatarClassName="w-8 h-8"
                                          avatarColor={loading.avatar_color}
                                          avatarFallbackClassName="font-medium text-white text-xs"
                                        />
                                      </TooltipTrigger>
                                      <TooltipContent>
                                        <p>
                                          {loading.user_firstname}{" "}
                                          {loading.user_lastname}
                                        </p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                              </div>
                            </td>
                            <td className=" p-2">
                              <div className="flex flex-col gap-1 items-center">
                                <span className="text-[11px] opacity-70">
                                  Type of Unit
                                </span>
                                <div className="flex flex-col gap-2 items-center">
                                  <span className="ms-2">
                                    {loading.loading_type_of_unit}
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                  <div className="absolute top-[5px] right-[5px]">
                    <MoreOption>
                      {[...loadingListMenu].map(
                        (option: any, optionKey: number) => (
                          <ItemMenu
                            key={`loading_${loadingKey}_option_${optionKey}`}
                            onClick={() =>
                              handleEventLoadingList(option.actionType, loading)
                            }
                          >
                            {option.icon}
                            <span className="font-medium">{option.name}</span>
                          </ItemMenu>
                        )
                      )}
                      <ItemMenu
                        key={`loading_${loadingKey}_view_details`}
                        onClick={() =>
                          handleEventLoadingList("details", loading)
                        }
                      >
                        <View
                          className={cn("mr-2 h-[18px] w-[18px] text-teal-600")}
                        />
                        <span className="font-medium">View Details</span>
                      </ItemMenu>
                    </MoreOption>
                  </div>
                </div>
              ))
            )}

          {isLoadingMore && <LoadingMore />}
        </div>
        <div className="p-2 sticky bottom-0">
          <Button
            className="w-full rounded-xl"
            onClick={() => setNewLoadingListModal(true)}
          >
            New Loading List
          </Button>
        </div>
      </ScrollArea>
    </>
  );
};

export default memo(LoadingList);
