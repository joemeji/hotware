import Combobox from "@/components/ui/combobox";
import React, { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { fetcher } from "@/utils/api.config";

export const WorkSelect = (props: WorkSelectProps) => {
  const { onChangeValue, value, disabled } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR('/api/loading-list/works', fetcher, swrOptions);

  const contentData = () => {
    return data && data.map((work: any) => {
      return {
        text: (
          <div>
            <span className="font-medium">{work.loading_work_name}</span>
          </div>
        ),
        value: work.loading_work_id,
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Combobox
        value={value}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className="h-10"
      // disabled={disabled}
      />
    </div>
  )
}

type WorkSelectProps = {
  onChangeValue?: any,
  value?: any,
  disabled?: boolean;
}