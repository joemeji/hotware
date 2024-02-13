import Combobox from "@/components/ui/combobox";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const RepetitionSelect = (props: IRepetitionSelect) => {
  const { onChangeValue, value } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR('/api/country/all', fetcher, swrOptions);

  const contentData = () => {

    return [
      {
        text: (
          <div>
            <span className='font-medium'>Once</span>
          </div>
        ),
        value: 0 as number 
      },
      {
        text: (
          <div>
            <span className='font-medium'>Every year</span>
          </div>
        ),
        value: 1 
      },
    ];
  }

  return (
    <div className="flex flex-col gap-2">
      <Combobox
        isLoading={isLoading}
        value={value}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className="h-10"
      />
    </div>
  )
}

type IRepetitionSelect = {
  onChangeValue?: (value?: any) => void
  value?: any
}