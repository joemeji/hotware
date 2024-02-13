import Combobox from "@/components/ui/combobox";
import ComboboxMultiple from "@/components/ui/combobox-multiple";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const TriggerSelect = (props: ITriggerSelect) => {
  const { onChangeValue, value, multiple, setValues: setValue } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR(
    "/api/trigger/all",
    fetcher,
    swrOptions
  );

  const contentData = () => {
    return (
      data &&
      data.length > 0 &&
      data.map((trigger: any, key: number) => {
        return {
          text: (
            <div key={key}>
              <span className='font-medium'>{trigger?.trigger_name}</span>
            </div>
          ),
          label: trigger?.trigger_name,
          value: trigger?.trigger_id,
        };
      })
    );
  };

  return (
    <div className='flex flex-col gap-2'>
      <ComboboxMultiple
        isLoading={isLoading}
        value={value}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className='h-10'
        defaultValue={[]}
      />
    </div>
  );
};

type ITriggerSelect = {
  onChangeValue?: (value?: any) => void;
  value?: any;
  multiple?: boolean;
  defaultValue?: any;
  setValues?: any;
};
