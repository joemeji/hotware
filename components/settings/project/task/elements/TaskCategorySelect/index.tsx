import Combobox from "@/components/ui/combobox";
import ComboboxMultiple from "@/components/ui/combobox-multiple";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const TaskCategorySelect = (props: ITaskCategorySelect) => {
  const { onChangeValue, value, multiple, setValues: setValue } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR(
    "/api/item/main-category/all",
    fetcher,
    swrOptions
  );

  const contentData = () => {
    return [
      {
        text: "Document Tasks (Send Email After Creating/Updating a Document",
        value: "document_task",
      },
      {
        text: "Individual Project Task",
        value: "project_task",
      },
      {
        text: "roject Template Task (This will be added when a project is created",
        value: "template_task",
      },
    ];
  };

  return (
    <div className='flex flex-col gap-2'>
      <Combobox
        isLoading={isLoading}
        value={value}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className='h-10'
      />
    </div>
  );
};

type ITaskCategorySelect = {
  onChangeValue?: (value?: any) => void;
  value?: any;
  multiple?: boolean;
  defaultValue?: any;
  setValues?: any;
};
