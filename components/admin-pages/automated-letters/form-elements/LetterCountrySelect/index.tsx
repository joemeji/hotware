import Combobox from "@/components/ui/combobox";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const LetterCountrySelect = (props: ILetterCountrySelect) => {
  const { onChangeValue, value } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR('/api/country/all', fetcher, swrOptions);

  const contentData = () => {

    return data && data.length > 0 && data.map((country: any, key: number) => {

      return {
        text: (
          <div key={key}>
            <span className="font-mediu  m">{country.country_name}</span>
          </div>
        ),
        value: country.country_id,
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

type ILetterCountrySelect = {
  onChangeValue?: (value?: any) => void
  value?: any
}