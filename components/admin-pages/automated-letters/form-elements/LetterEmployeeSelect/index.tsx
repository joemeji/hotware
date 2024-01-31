import Combobox from "@/components/ui/combobox";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const LetterEmployeeSelect = (props: ILetterEmployeeSelect) => {
  const { onChangeValue, value, placeholder } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR('/api/user/all', fetcher, swrOptions);

  const contentData = () => {

    return data && data.length > 0 && data.map((user: any, key: number) => {

      return {
        text: (
          <div key={key}>
            <span className="font-medium">{`${user.user_firstname} ${user.user_lastname}`}</span>
          </div>
        ),
        value: user.user_id,
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <Combobox
        isLoading={isLoading}
        value={value}
        placeholder={placeholder}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className="h-10"
      />
    </div>
  )
}

type ILetterEmployeeSelect = {
  onChangeValue?: (value?: any) => void
  placeholder?: string
  value?: any
}