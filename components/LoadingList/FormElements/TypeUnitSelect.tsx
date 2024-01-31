import Combobox from "@/components/ui/combobox";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const TypeUnitSelect = (props: TypeUnitSelectProps) => {
  const { onChangeValue, value } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR('/api/loading-list/type_unit', fetcher, swrOptions);

  const contentData = () => {
    return data && data.map((type_unit: any, key: number) => {
      return {
        text: (
          <div key={key}>
            <span className="font-medium">{type_unit.loading_type_name}</span>
          </div>
        ),
        value: type_unit.loading_type_id,
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
      />
    </div>
  )
}

type TypeUnitSelectProps = {
  onChangeValue?: (value?: any) => void,
  value?: any
}