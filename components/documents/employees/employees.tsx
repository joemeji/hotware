import AvatarProfile from "@/components/AvatarProfile";
import { beginScrollDataPagerForInfiniteswr } from "@/components/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AccessTokenContext } from "@/context/access-token-context";
import { cn } from "@/lib/utils";
import { baseUrl, fetchApi } from "@/utils/api.config";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useContext, useEffect, useMemo } from "react";
import useSWRInfinite from "swr/infinite";

const Employees = ({ filterHeight, onClickEmployee }: Employees) => {
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();

  const { data, isLoading, error, size, setSize, isValidating } =
    useSWRInfinite((index) => {
      let paramsObj: any = {};
      paramsObj["page"] = index + 1;
      paramsObj["per_page"] = 20;
      let searchParams = new URLSearchParams(paramsObj);
      return [
        !open ? null : `/api/users?${searchParams.toString()}`,
        access_token,
      ];
    }, fetchApi);

  const onscrollend = () => {
    const currentPage = beginScrollDataPagerForInfiniteswr(_data);
    if (currentPage) {
      setSize(currentPage + 1);
    }
  };

  const _data: any = useMemo(() => (data ? [].concat(...data) : []), [data]);
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  useEffect(() => {
    if (Array.isArray(_data)) {
      const users: any = [];

      _data.forEach((item: any) => {
        if (Array.isArray(item.users)) {
          item.users.forEach((user: any) => {
            users.push(user);
          });
        }
      });

      if (Array.isArray(users) && users.length > 0) {
        const user = users.find(
          (user: any) => user._user_id === router.query?.user_id
        );
        onClickEmployee && onClickEmployee(user);
      }
    }
  }, [_data, onClickEmployee, router.query?.user_id]);

  return (
    <ScrollArea
      className="bg-white rounded-app"
      viewPortClassName=" h-[400px]"
      viewPortStyle={{
        height: `calc(100vh - ${filterHeight + "px"
          } - 50px - var(--header-height))`,
      }}
      onScrollEndViewPort={onscrollend}
    >
      <div className="sticky top-0 z-10 backdrop-blur px-3 py-3 flex flex-col gap-2">
        <p className="text-base font-medium">Employees</p>
        <div className="bg-stone-100 flex items-center w-full rounded-app px-2 h-10 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background ring-offset-2 border border-input">
          <Search className="text-stone-400 w-5 h-5" />
          <input
            type="search"
            placeholder="Search"
            className="outline-none text-sm w-full px-2 bg-transparent h-full"
          />
        </div>
      </div>

      <div className="flex flex-col px-3 pb-3">
        {Array.isArray(_data) &&
          _data.map((data: any) => {
            return (
              Array.isArray(data?.users) &&
              data.users.map((user: any, key: number) => (
                <Link
                  shallow
                  href={`?parent_id=0&user_id=${user._user_id}`}
                  key={key}
                  className={cn(
                    "flex gap-2 hover:bg-stone-200 p-2 rounded-xl text-left w-full",
                    user._user_id === router.query?.user_id && "bg-stone-300"
                  )}
                  onClick={() => onClickEmployee && onClickEmployee(user)}
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
                      className="font-medium whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `calc(var(--maxWidth) - 15px)` }}
                    >
                      {user.user_firstname} {user.user_lastname}
                    </p>
                    <p
                      className="whitespace-nowrap overflow-hidden text-ellipsis"
                      style={{ width: `calc(var(--maxWidth) - 15px)` }}
                      title={user.email}
                    >
                      {user.email}
                    </p>
                  </div>
                </Link>
              ))
            );
          })}
      </div>
      {/* {isLoadingMore && <LoadingMore />} */}
    </ScrollArea>
  );
};

type Employees = {
  filterHeight?: number;
  onClickEmployee?: (user: any) => void;
};

export default memo(Employees);
