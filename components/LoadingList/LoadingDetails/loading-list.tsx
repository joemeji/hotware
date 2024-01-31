import MoreOption from "@/components/MoreOption";
import React, { memo, useState } from "react";
import { baseUrl, fetchApi, fetcher } from "@/utils/api.config";
import { ItemMenu, loadingListMenu } from "..";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import AvatarProfile from "@/components/AvatarProfile";
import EditLoadingListDetailsModal from "../modals/EditLoadingListDetailsModal";
import { DeleteLoadingListModal } from "../modals/DeleteLoadingListModal";
import useSWR from "swr";
import { Search, X } from "lucide-react";
import { useRouter } from "next/router";
import { useRouter as useRouterNav } from "next/navigation";
import { Input } from "@/components/ui/input";

type LoadingListProps = {
  onClickItem?: (loadingDetails: any) => void,
  access_token?: any
}

const LoadingList = ({ onClickItem, access_token }: LoadingListProps) => {
  const router = useRouter();
  const { push } = useRouterNav();
  const [search, setSearch] = useState("");

  const payload: any = {};
  if (router.query.search) payload["search"] = router.query.search;
  const queryString = new URLSearchParams(payload).toString();

  const [editLoadingListModal, setEditLoadingListModal] = useState(false);
  const [deleteLoadingListModal, setDeleteLoadingListModal] = useState(false);
  const [loadingID, setLoadingID] = useState(null);

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };
  // const { data, isLoading, error } = useSWR(
  //   [`/api/loading-list/lists?${queryString}?${queryString}`, access_token],
  //   fetchApi,
  //   {
  //     revalidateOnFocus: false,
  //     revalidateIfStale: false,
  //   }
  // );

  const { data, isLoading, error } = useSWR(`/api/loading-list/lists`, fetcher, swrOptions);

  const handleEventLoadingList = (e: any) => {
    let actionType = e.target.dataset.menu;
    let _loadingID = e.target.dataset.loading;

    if (actionType == 'edit') {
      setEditLoadingListModal(true);
      setLoadingID(_loadingID);
    } else if (actionType == 'delete') {
      setDeleteLoadingListModal(true);
      setLoadingID(_loadingID);
    }
  }

  const onPaginate = (page: string) => {
    router.query.page = page;
    router.push(router);
  };

  const onSearch = () => {
    if (!search) return;
    router.query.search = search;
    router.push(router);
  };

  return (
    <>
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
      <form onSubmit={onSearch}>
        <div className="top-0 sticky z-10 inset-0 backdrop-blur-md p-3">
          <p className="font-medium text-lg mb-2">Loading Lists</p>
          <div className="bg-stone-100 flex items-center w-full rounded-app px-2 h-10 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background ring-offset-2 border border-input">
            <Search className="text-stone-400 w-5 h-5" />
            <input
              type="search"
              placeholder="Search"
              className="outline-none text-sm w-full px-2 bg-transparent h-full"
              name="search"
              value={search}
              onKeyUp={(e: any) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </form >
      {data && data.data.map((loading: any, key: number) => (
        <div className="w-full rounded-app px-4 py-2 flex justify-between justify-items-center hover:bg-stone-100 hover:cursor-pointer" key={key}>
          <div className="flex flex-col justify-self-start gap-3" onClick={() => onClickItem && onClickItem(loading)}>
            <div>
              <p className="font-medium">{loading.loading_description}</p>
              <p className="opacity-80">{loading.loading_work}</p>
            </div>
            <div className="w-full flex flex-row items-center">
              <div>
                <TooltipProvider delayDuration={400}>
                  <Tooltip>
                    <TooltipTrigger>
                      <AvatarProfile
                        firstname={loading.user_firstname}
                        lastname={loading.user_lastname}
                        photo={baseUrl + '/users/thumbnail/' + loading.user_photo}
                        avatarClassName="w-7 h-7"
                        avatarColor={loading.avatar_color}
                        avatarFallbackClassName="font-medium text-white text-xs"
                      />
                      <TooltipContent>
                        <p>{loading.user_firstname} {loading.user_lastname}</p>
                      </TooltipContent>
                    </TooltipTrigger>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <span className="font-light ms-2">{loading.user_firstname} {loading.user_lastname}</span>
            </div>
          </div>
          <div className="">
            <MoreOption>
              {[...loadingListMenu].map((option: any, key: number) => (
                <ItemMenu key={key} data-menu={option.actionType} data-loading={loading.loading_id} onClick={handleEventLoadingList}>
                  {option.icon}
                  <span className="font-medium" data-menu={option.actionType} data-loading={loading.loading_id}>{option.name}</span>
                </ItemMenu>
              ))}
            </MoreOption>
          </div>

        </div>
      ))
      }
    </>
  )
}

export default memo(LoadingList)