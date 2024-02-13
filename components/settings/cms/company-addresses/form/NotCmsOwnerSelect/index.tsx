import Combobox from "@/components/ui/combobox";
import ComboboxMultiple from "@/components/ui/combobox-multiple";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const NotCmsOwnerSelect = (props: IVatTypeSelect) => {
  const { onChangeValue, value } = props;

  const { data, isLoading, error } = useSWR(
    "/api/cms/company-addresses/cms-owner",
    fetcher
  );

  const contentData = () => {
    return (
      data &&
      data.length > 0 &&
      data.map((cmsOwner: any, key: number) => {
        return {
          text: (
            <div key={key}>
              <span className='font-medium'>{cmsOwner.cms_name}</span>
            </div>
          ),
          value: cmsOwner.cms_id,
        };
      })
    );
  };

  return (
    <div className='flex flex-col gap-2'>
      <Combobox
        value={value}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className='h-10'
        isLoading={isLoading}
      />
    </div>
  );
};

type IVatTypeSelect = {
  onChangeValue?: (value?: any) => void;
  value?: any;
  defaultValue?: any;
  setValues?: any;
};
