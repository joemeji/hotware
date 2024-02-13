import Combobox from "@/components/ui/combobox";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const ServiceSelect = (props: ServiceSelectProps) => {
  const { onChangeValue, value } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR('/api/user/get_services', fetcher, swrOptions);

  const contentData = () => {
    return data && data.map((service: any, key: number) => {
      return {
        text: (
          <div key={key}>
            <span className="font-medium">{service.user_service_name}</span>
          </div>
        ),
        value: service.user_service_id,
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

type ServiceSelectProps = {
  onChangeValue?: (value?: any) => void,
  value?: any
}