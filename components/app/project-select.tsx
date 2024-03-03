import Combobox from "../ui/combobox";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import useSWRInfinite from "swr/infinite";
import { beginScrollDataPagerForInfiniteswr } from "../pagination";

const Project = (props: ProjectProps) => {
  const { data: session }: any = useSession();
  const { value, onChangeValue, placeholder, error: formError } = props;
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading, error, mutate, size, setSize, isValidating } = useSWRInfinite((index) => {
    let paramsObj: any = {};
    paramsObj["page"] = index + 1;
    paramsObj["search"] = search;
    let searchParams = new URLSearchParams(paramsObj);
    return [session?.user?.access_token && `/api/projects/getAll?${searchParams}`, session?.user?.access_token];
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
        if (item && Array.isArray(item.project)) {
          item.project.forEach((item: any) => {
            items.push({
              text: (
                <div
                  className={cn(
                    "flex justify-between py-1",
                    "items-start hover:bg-stone-100 cursor-pointer"
                  )}
                >
                  <div className="flex gap-2 items-center justify-between w-full">
                    <span className="font-medium">
                      {item.project_name + " (" + item.project_number + ")"}
                    </span>
                  </div>
                </div>
              ),
              value: item.project_id,
            });
          });
        }
      });
    }
    return items;
  };

  return (
    <div className="flex flex-col gap-1">
      <Combobox
        contents={contentData()}
        placeholder={placeholder}
        value={value}
        onChangeValue={onChangeValue}
        isLoading={isLoading}
        className={cn(formError && formErrorClassNames)}
        onScrollEnd={onscrollend}
        isLoadingMore={isLoadingMore}
        onOpenChange={open => setIsOpenPopover(open)}
        onSearch={(value: any) => {
          setSearch(value);
        }}
      />
      {formError && <ErrorFormMessage message={formError.message} />}
    </div>
  );
};

type ProjectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
};

export default Project;
