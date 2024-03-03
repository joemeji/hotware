import React, { useContext, useState } from "react";
import { AccessTokenContext } from "@/context/access-token-context";
import { fetchApi } from "@/utils/api.config";
import useSWRInfinite from "swr/infinite";
import Image from "next/image";
import { beginScrollDataPagerForInfiniteswr } from "@/components/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchInput from "@/components/app/search-input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import TaskModal from "./TaskModal";
import { UserAvatar } from "@/components/documents/employees/list";

export default function MyProjectTask({ maxheight }: { maxheight?: number }) {
  const access_token = useContext(AccessTokenContext);
  const [openTask, setOpenTask] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [search, setSearch] = useState<any>("");

  const { data, isLoading, error, size, setSize, isValidating, mutate } =
    useSWRInfinite((index) => {
      let params: any = {};

      params["page"] = index + 1;

      if (search) params = { search };

      let searchParams = new URLSearchParams(params);
      return [
        `/api/projects/getProjectTasks?${searchParams.toString()}`,
        access_token,
      ];
    }, fetchApi);

  const _data: any = data ? [].concat(...data) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const onViewTask = (task: any) => {
    setSelectedTask(task);
    setOpenTask(true);
  };

  const onscrollend = () => {
    const currentPage = beginScrollDataPagerForInfiniteswr(_data, size);
    if (currentPage) {
      setSize(currentPage + 1);
    }
  };

  return (
    <>
      <TaskModal
        open={openTask}
        onOpenChange={(open: any) => {
          setOpenTask(open);
          if (!open) setSelectedTask(null);
        }}
        _project_id={selectedTask?._project_id}
        onSuccess={() => mutate(data)}
      />
      <div className="w-[35%] bg-white rounded-xl shadow">
        <ScrollArea
          viewPortStyle={{
            maxHeight: maxheight + "px",
          }}
          onScrollEndViewPort={onscrollend}
        >
          <div className="flex justify-between items-center px-4 py-4">
            <p className="text-base flex font-medium">My Project Task</p>
            <div className="flex items-center gap-2">
              <SearchInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                delay={1000}
                placehoder={"Search Project"}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 px-4 py-2">
            {Array.isArray(_data) &&
              _data.map((data: any) => {
                return (
                  Array.isArray(data?.list) &&
                  data.list.map((row: any, key: number) => (
                    <React.Fragment key={key}>
                      <div className="p-3 flex flex-col gap-3 rounded-xl border border-stone-100 hover:bg-stone-100 relative">
                        <div className="flex flex-col">
                          <p className="font-medium text-blue-600">
                            {row.project_number}
                          </p>
                          <p className="font-medium">{row.project_name}</p>
                        </div>
                        <div className="flex justify-between items-end">
                          <UserAvatar
                            firstname={row.user_firstname}
                            lastname={row.user_lastname}
                            avatar_color={row.avatar_color}
                            photo={row.user_photo}
                            avatarClassName="w-[35px] h-[35px]"
                          />
                          <Button
                            variant={"outline"}
                            className="py-1 px-3 rounded-full font-normal text-[12px] absolute top-2 right-2"
                            onClick={() => onViewTask(row)}
                          >
                            View{" "}
                            {row.total_tasks.length +
                              `${
                                row.total_tasks.length > 1 ? " tasks" : " task"
                              }`}
                          </Button>
                        </div>
                      </div>
                    </React.Fragment>
                  ))
                );
              })}

            {Array.isArray(_data) &&
              Array.isArray(_data[0]?.list) &&
              _data[0].list.length === 0 && <NoDataFound />}

            {isLoadingMore && (
              <div className="flex flex-col gap-2 py-2">
                <Skeleton className="w-[300px] h-[15px]" />
                <Skeleton className="w-[100px] h-[15px]" />
              </div>
            )}

            {/* {Array.isArray(_data) &&
              Array.isArray(_data[0]?.list) &&
              _data[0].list.length > 0 &&
              !isLoadingMore && (
                <div className="py-2 flex justify-center">
                  <Button variant={"outline"} onClick={onLoadMore}>
                    Load More
                  </Button>
                </div>
              )} */}
          </div>
        </ScrollArea>
      </div>
    </>
  );
}

function NoDataFound() {
  return (
    <div className="flex justify-center">
      <Image
        src="/images/No data-rafiki.svg"
        width={300}
        height={300}
        alt="No Data to Shown"
      />
    </div>
  );
}
