
import Combobox from "@/components/ui/combobox";
import ComboboxMultiple from "@/components/ui/combobox-multiple";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const ItemCategoriesSelect = (props: ILetterDocumentTypeSelect) => {
  const { onChangeValue, value, multiple , setValues: setValue} = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR(
    "/api/item/category/all",
    fetcher,
    swrOptions
  );

  const contentData = () => {
    return (
      data &&
      data.length > 0 &&
      data.map((category: any, key: number) => {
        return {
          text: (
            <div key={key}>
              <span className='font-medium'>{category?.item_category_name}</span>
            </div>
          ),
          value: category?.item_category_id,
        };
      })
    );
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

type ILetterDocumentTypeSelect = {
  onChangeValue?: (value?: any) => void;
  value?: any;
  multiple?: boolean
  defaultValue?: any
  setValues?: any
};
