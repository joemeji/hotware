import { useContext } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { AccessTokenContext } from "@/context/access-token-context";
import useSWRInfinite from "swr/infinite";
import { baseUrl, fetchApi } from "@/utils/api.config";
import { beginScrollDataPagerForInfiniteswr } from "../pagination";
import AvatarProfile from "../AvatarProfile";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

const BlockedEmployeeSelect = ({
  height,
  search,
  onSelect,
  selected,
}: BlockedEmployeeSelectType) => {
  const access_token = useContext(AccessTokenContext);

  const { data, isLoading, error, size, setSize, isValidating } =
    useSWRInfinite((index) => {
      let paramsObj: any = {};

      paramsObj["page"] = index + 1;
      paramsObj["per_page"] = 20;

      if (search) paramsObj["search"] = search;

      let searchParams = new URLSearchParams(paramsObj);

      return [
        !open ? null : `/api/users?${searchParams.toString()}`,
        access_token,
      ];
    }, fetchApi);

  const _data: any = data ? [].concat(...data) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const onscrollend = () => {
    const currentPage = beginScrollDataPagerForInfiniteswr(_data, size);
    if (currentPage) {
      setSize(size + 1);
    }
  };

  return (
    <ScrollArea
      viewPortStyle={{ height: `${height}px` }}
      viewPortClassName="w-full"
      onScrollEndViewPort={onscrollend}
    >
      <div className="flex flex-col px-3 pb-3 pt-[1px]">
        {Array.isArray(_data) &&
          _data.map((data: any) => {
            return (
              Array.isArray(data?.users) &&
              data.users.map((user: any, key: number) => (
                <div
                  tabIndex={0}
                  key={key}
                  className={cn(
                    "flex gap-2 hover:bg-stone-200 p-2 rounded-xl text-left w-full cursor-pointer items-center",
                    selected?.user_id === user.user_id &&
                      "bg-stone-300 hover:bg-stone-300"
                  )}
                  onClick={() => {
                    if (selected?.user_id === user.user_id) {
                      onSelect && onSelect(null);
                    } else {
                      onSelect && onSelect(user);
                    }
                  }}
                >
                  <AvatarProfile
                    firstname={user.user_firstname}
                    lastname={user.user_lastname}
                    avatarColor={user.avatar_color}
                    photo={baseUrl + "/users/thumbnail/" + user.user_photo}
                    avatarClassName="text-white font-medium"
                  />
                  <div
                    className="flex flex-col w-full"
                    ref={(el) => {
                      if (el) {
                        el.style.setProperty(
                          "--maxWidth",
                          `${el.offsetWidth}px`
                        );
                      }
                    }}
                  >
                    <p
                      className="font-medium whitespace-nowrap overflow-hidden text-ellipsis w-full"
                      style={{ maxWidth: `calc(var(--maxWidth) - 15px)` }}
                    >
                      {user.user_firstname} {user.user_lastname}
                    </p>
                    {/* <p
                          className="whitespace-nowrap overflow-hidden text-ellipsis"
                          style={{ width: `calc(var(--maxWidth) - 15px)` }}
                          title={user.email}
                        >
                          {user.email}
                        </p> */}
                  </div>
                </div>
              ))
            );
          })}

        {isLoadingMore && (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2 px-2">
              <Skeleton className="w-[40px] h-[40px] rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="w-[200px] h-[15px]" />
                <Skeleton className="w-[100px] h-[15px]" />
              </div>
            </div>

            <div className="flex gap-2 px-2">
              <Skeleton className="w-[40px] h-[40px] rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="w-[200px] h-[15px]" />
                <Skeleton className="w-[100px] h-[15px]" />
              </div>
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default BlockedEmployeeSelect;

type BlockedEmployeeSelectType = {
  height?: number;
  search?: any;
  onSelect?: (user?: any) => void;
  selected?: any;
};
