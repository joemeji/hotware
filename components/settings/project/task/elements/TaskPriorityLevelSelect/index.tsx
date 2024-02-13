import Combobox from "@/components/ui/combobox";
import ComboboxMultiple from "@/components/ui/combobox-multiple";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const TaskPriorityLevelSelect = (props: ITaskPriorityLevelSelect) => {
  const { onChangeValue, value, multiple, setValues: setValue } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const contentData = () => {
    return [
      {
        text: "Low",
        value: "Low",
      },
      {
        text: "Medium",
        value: "Medium",
      },
      {
        text: "High",
        value: "High",
      },
      {
        text: "Urgent",
        value: "Urgent",
      },
    ];
  };

  return (
    <div className='flex flex-col gap-2'>
      <Combobox
        value={value}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className='h-10'
      />
    </div>
  );
};

type ITaskPriorityLevelSelect = {
  onChangeValue?: (value?: any) => void;
  value?: any;
  multiple?: boolean;
  defaultValue?: any;
  setValues?: any;
};
