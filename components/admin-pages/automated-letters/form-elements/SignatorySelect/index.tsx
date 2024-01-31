import Combobox from "@/components/ui/combobox";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const SignatorySelect = (props: ISignatorySelect) => {
  const { onChangeValue, value } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR('/api/signatory/lists', fetcher, swrOptions);

  const contentData = () => {
    return data && data.map((signatory: any, key: number) => {
      return {
        text: (
          <div key={key}>
            <span className="font-medium">{signatory.user_firstname} {signatory.user_lastname}</span>
          </div>
        ),
        value: signatory.user_id,
      }
    });
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

type ISignatorySelect = {
  onChangeValue?: (value?: any) => void,
  value?: any
}