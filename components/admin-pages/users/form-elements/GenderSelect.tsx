import Combobox from "@/components/ui/combobox";
import React, { useEffect, useState } from "react";

const genders = [
  {
    name: "Male"
  },
  {
    name: "Female"
  }
];

export const GenderSelect = (props: GenderSelectProps) => {
  const { onChangeValue, value } = props;

  const contentData = () => {
    return genders && genders.map((gender: any, key: number) => {
      return {
        text: (
          <div key={key}>
            <span className="font-medium">{gender.name}</span>
          </div>
        ),
        value: gender.name,
      }
    });
  }
  return (
    <div className="flex flex-col gap-2">
      <Combobox
        value={value}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className="h-10"
      />
    </div>
  )
}

type GenderSelectProps = {
  onChangeValue?: (value?: any) => void,
  value?: any
}