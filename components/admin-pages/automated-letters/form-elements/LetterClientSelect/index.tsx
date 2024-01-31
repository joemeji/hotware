import Combobox from "@/components/ui/combobox";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const LetterClientSelect = (props: IDocumentTypeSelect) => {
  const { onChangeValue, value } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR('/api/cms/clients', fetcher, swrOptions);

  const contentData = () => {

    return data && data.length > 0 && data.map((client: any, key: number) => {

      return {
        text: (
          <div key={key}>
            <span className="font-medium">{client.cms_name}</span>
          </div>
        ),
        value: client.cms_id,
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

type IDocumentTypeSelect = {
  onChangeValue?: (value?: any) => void
  value?: any
}