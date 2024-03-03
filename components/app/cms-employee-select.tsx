import Combobox from "../ui/combobox";
import useSWR from "swr";
import { fetcher } from "@/utils/api.config";
import AvatarProfile from "../AvatarProfile";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { beginScrollDataPagerForInfiniteswr } from "../pagination";
import useSWRInfinite from "swr/infinite";

const CmsEmployeeSelect = (props: CmsEmployeeSelectProps) => {
  const { value, onChangeValue, placeholder, cms_id, onChange } = props;
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [search, setSearch] = useState("");

  const { data, isLoading, error, mutate, size, setSize, isValidating } =
    useSWRInfinite((index) => {
      let paramsObj: any = {};
      paramsObj["page"] = index + 1;
      paramsObj["search"] = search;
      let searchParams = new URLSearchParams(paramsObj);
      return [`/api/cms/${cms_id}/cms_employee?search=${search}`];
    }, fetcher);

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
        if (item && Array.isArray(item.users)) {
          item.users.forEach((employee: any) => {
            items.push({
              text: (
                <div
                  className={cn(
                    "flex gap-2 items-center",
                    employee.cms_employee_phone_number && "items-start"
                  )}
                >
                  <AvatarProfile
                    firstname={employee.cms_employee_firstname}
                    lastname={employee.cms_employee_lastname}
                    avatarColor={employee.avatar_color}
                    photo={employee.cms_employee_photo}
                    avatarClassName="text-white font-medium"
                  />
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {employee.cms_employee_firstname}{" "}
                      {employee.cms_employee_lastname}
                    </span>
                    {employee.cms_employee_phone_number && (
                      <span>{employee.cms_employee_phone_number}</span>
                    )}
                  </div>
                </div>
              ),
              value: employee.cms_employee_id,
            });
          });
        }
      });
    }
    return items;
  };

  return (
    <Combobox
      contents={contentData()}
      placeholder={placeholder}
      value={value}
      onChangeValue={(value) => {
        onChangeValue && onChangeValue(value);
        if (Array.isArray(data)) {
          const employee = data.find(
            (item: any) => item.cms_employee_id == value
          );
          onChange && onChange(employee);
        }
      }}
      onOpenChange={(open) => {
        setIsOpenPopover(open);
        mutate(data);
      }}
      isLoadingMore={isLoadingMore}
      onScrollEnd={onscrollend}
      onSearch={(value: any) => {
        setSearch(value);
      }}
    />
  );
};

type CmsEmployeeSelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  cms_id?: any;
  onChange?: (employee?: any) => void;
};

export default React.memo(CmsEmployeeSelect);
