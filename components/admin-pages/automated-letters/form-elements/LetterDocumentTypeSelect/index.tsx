import Combobox from "@/components/ui/combobox";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const LetterDocumentTypeSelect = (props: ILetterDocumentTypeSelect) => {
  const { onChangeValue, value } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR('/api/letter-category/lists', fetcher, swrOptions);

  const contentData = () => {

    return data && data.length > 0 && data.map((letter: any, key: number) => {

      return {
        text: (
          <div key={key}>
            <span className="font-medium">{letter.letter_category_name}</span>
          </div>
        ),
        value: letter.letter_category_type,
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

type ILetterDocumentTypeSelect = {
  onChangeValue?: (value?: any) => void
  value?: any
}