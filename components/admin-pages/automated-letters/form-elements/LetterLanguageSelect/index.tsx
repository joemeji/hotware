import Combobox from "@/components/ui/combobox";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const LetterLanguageSelect = (props: ILetterLanguageSelect) => {
  const { onChangeValue, value, placeholder } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };


  const contentData = () => {
    return [{
      text: 'English',
      value: 'English'
    },
    {
      text: 'Portuguese',
      value: 'Portuguese'
    }
    ]

  }

  return (
    <div className="flex flex-col gap-2">
      <Combobox
        value={value}
        placeholder={placeholder}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className="h-10"
      />
    </div>
  )
}

type ILetterLanguageSelect = {
  onChangeValue?: (value?: any) => void
  placeholder?: string
  value?: any
}