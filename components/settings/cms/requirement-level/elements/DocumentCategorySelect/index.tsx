import Combobox from "@/components/ui/combobox";
import ComboboxMultiple from "@/components/ui/combobox-multiple";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const DocumentCategorySelect = (props: IDocumentCategorySelect) => {
  const { onChangeValue, value, typeId } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR(
    `/api/document/categories/all?typeId=${typeId}`,
    fetcher,
    swrOptions
  );

  const contentData = () => {
    return (
      data &&
      data.length > 0 &&
      data.map((dCategory: any, key: number) => {
        return {
          text: (
            <div key={key}>
              <span className='font-medium'>
                {dCategory.document_category_name}
              </span>
            </div>
          ),
          label: dCategory.document_category_name,
          value: dCategory.document_category_id,
        };
      })
    );
  };

  return (
    <div className='flex flex-col gap-2'>
      <ComboboxMultiple
        value={value}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className='h-10'
      />
    </div>
  );
};

type IDocumentCategorySelect = {
  onChangeValue?: (value?: any) => void;
  value?: any;
  typeId: string;
};
