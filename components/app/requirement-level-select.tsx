import Combobox from "../ui/combobox";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import ComboboxMultiple from "../ui/combobox-multiple";
import useSWRInfinite from "swr/infinite";
import { beginScrollDataPagerForInfiniteswr } from "../pagination";

const RequirementLevelSelect = (props: RequirementLevelSelectProps) => {
  const { data: session }: any = useSession();
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [search, setSearch] = useState("");

  const {
    value,
    onChangeValue,
    placeholder,
    error: formError,
    companyId,
    className,
    multiple,
    setValues: setValue,
    onChangeReqLevel,
  } = props;

  const { data, isLoading, error, mutate, size, setSize, isValidating } =
    useSWRInfinite((index) => {
      let paramsObj: any = {};
      paramsObj["page"] = index + 1;
      paramsObj["search"] = search;
      let searchParams = new URLSearchParams(paramsObj);
      return [
        session?.user?.access_token &&
          `/api/requirementlevel/get_all_levels?${searchParams}`,
        session?.user?.access_token,
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
        if (item && Array.isArray(item.requirement)) {
          item.requirement.forEach((item: any) => {
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
                      {item.document_level_name}
                    </span>
                  </div>
                </div>
              ),
              label: item.document_level_name,
              value: item.document_level_id,
            });
          });
        }
      });
    }
    return items;
  };

  const _onChangeValue = (value: any) => {
    onChangeValue && onChangeValue(value);
    const reqLevel =
      Array.isArray(data) &&
      data.find((item: any) => item.document_level_id === value);
    onChangeReqLevel && onChangeReqLevel(reqLevel);
  };

  const docReqs =
    Array.isArray(data) && data.map((d: any) => d.document_level_id);

  useEffect(() => {
    if (docReqs && setValue) {
      setValue("requirement_levels", docReqs);
    }
  }, [data, docReqs, setValue]);

  if (multiple) {
    return (
      <div className="flex flex-col gap-1">
        <ComboboxMultiple
          isLoading={isLoading}
          value={value}
          onChangeValue={_onChangeValue}
          contents={contentData()}
          className="h-10"
          // defaultValue={docReqs}
          onScrollEnd={onscrollend}
          isLoadingMore={isLoadingMore}
          onOpenChange={(open) => setIsOpenPopover(open)}
          onSearch={(value: any) => {
            setSearch(value);
          }}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Combobox
        contents={contentData()}
        placeholder={placeholder}
        value={value}
        onChangeValue={_onChangeValue}
        isLoading={isLoading}
        className={cn(className, formError && formErrorClassNames)}
        onScrollEnd={onscrollend}
        isLoadingMore={isLoadingMore}
        onOpenChange={(open) => setIsOpenPopover(open)}
        onSearch={(value: any) => {
          setSearch(value);
        }}
      />
      {formError && <ErrorFormMessage message={formError.message} />}
    </div>
  );
};

type RequirementLevelSelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
  companyId?: any;
  className?: string | undefined;
  multiple?: boolean;
  setValues?: any;
  onChangeReqLevel?: (reqLevel?: any) => void;
};

export default React.memo(RequirementLevelSelect);
