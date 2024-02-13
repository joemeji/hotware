import Combobox from "@/components/ui/combobox";
import ComboboxMultiple from "@/components/ui/combobox-multiple";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const VatTypeSelect = (props: IVatTypeSelect) => {
  const { onChangeValue, value } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const contentData = () => {
    return [
      {
        text: (
          <div>
            <span className='font-medium'>Offer</span>
          </div>
        ),
        value: "Offer",
      },
      {
        text: (
          <div>
            <span className='font-medium'>Order Confirmation</span>
          </div>
        ),
        value: "Order Confirmation",
      },
      {
        text: (
          <div>
            <span className='font-medium'>Delivery Note</span>
          </div>
        ),
        value: "Delivery Note",
      },
      {
        text: (
          <div>
            <span className='font-medium'>Invoice</span>
          </div>
        ),
        value: "Invoice",
      },
      {
        text: (
          <div>
            <span className='font-medium'>Purchase Order</span>
          </div>
        ),
        value: "Purchase Order",
      },
    ];
  };

  return (
    <div className='flex flex-col gap-2'>
      <Combobox
        value={value}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className='h-10'
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
