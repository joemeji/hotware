import Combobox from "@/components/ui/combobox";
import React, { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { fetcher } from "@/utils/api.config";

const data = [
  {
    id: "0",
    name: "Article Number",
  },
  {
    id: "1",
    name: "Serial Number",
  },
];

export const ManageSetBy = (props: HsProps) => {
  const { onChangeValue, value, disabled } = props;

  const contentData = () => {
    const content = data.map((item: any, key: number) => {
      return {
        text: (
          <div key={key}>
            <span className="font-medium">{item.name}</span>
          </div>
        ),
        value: item.id,
      };
    });

    return content;
  };

  console.log("value:", value);

  return (
    <div className="flex flex-col gap-2">
      <Combobox
        value={value}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className="h-10"
        // disabled={disabled}
      />
    </div>
  );
};

type HsProps = {
  onChangeValue?: (value: any) => void;
  value?: any;
  disabled?: boolean;
};
