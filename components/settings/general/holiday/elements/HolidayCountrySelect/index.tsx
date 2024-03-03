import ComboboxMultiple from "@/components/ui/combobox-multiple";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const HolidayCountrySelect = (props: IDocumentTypeSelect) => {
  const { onChangeValue, value, defaultValue } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR(
    "/api/country/all",
    fetcher,
    swrOptions
  );

  const contentData = () => {
    return (
      data &&
      data.length > 0 &&
      data.map((country: any, key: number) => {
        return {
          text: (
            <div key={key}>
              <span className="font-medium">{country.country_name}</span>
            </div>
          ),
          label: country.country_name,
          value: country.country_id,
        };
      })
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <ComboboxMultiple
        placeholder="Choose"
        isLoading={isLoading}
        value={value}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className="h-10"
        // defaultValue={defaultValue}
      />
    </div>
  );
};

type IDocumentTypeSelect = {
  onChangeValue?: (value?: any) => void;
  defaultValue?: any;
  value?: any;
};
