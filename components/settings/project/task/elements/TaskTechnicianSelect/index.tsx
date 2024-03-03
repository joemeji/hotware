import ComboboxMultiple2 from "@/components/ui/combobox-multiple";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const TaskTechnicianSelect = (props: ITaskTechnicianSelect) => {
  const { onChangeValue, value, multiple, setValues: setValue } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR(
    "/api/user/technicians",
    fetcher,
    swrOptions
  );

  const contentData = () => {
    return (
      data &&
      data.length > 0 &&
      data.map((user: any, key: number) => {
        return {
          text: (
            <div key={key}>
              <span className="font-medium">
                {user?.user_firstname + " " + user?.user_lastname}
              </span>
            </div>
          ),
          label: user?.user_firstname + " " + user?.user_lastname,
          value: user?.id,
        };
      })
    );
  };

  console.log("technician value");

  return (
    <div className="flex flex-col gap-2">
      <ComboboxMultiple2
        isLoading={isLoading}
        value={value}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className="h-10"
      />
    </div>
  );
};

type ITaskTechnicianSelect = {
  onChangeValue?: (value?: any) => void;
  value?: any;
  multiple?: boolean;
  defaultValue?: any;
  setValues?: any;
};
