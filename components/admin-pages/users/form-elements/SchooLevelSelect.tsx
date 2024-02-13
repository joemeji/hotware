import Combobox from "@/components/ui/combobox";
import React, { useEffect, useState } from "react";

const status = [
  {
    name: "Primary"
  },
  {
    name: "Secondary"
  },
  {
    name: "Tertiary"
  }
];

export const SchoolLevelSelect = (props: SchoolLevelSelectProps) => {
  const { onChangeValue, value } = props;

  const contentData = () => {
    return status && status.map((item: any, key: number) => {
      return {
        text: (
          <div key={key}>
            <span className="font-medium">{item.name}</span>
          </div>
        ),
        value: item.name,
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

type SchoolLevelSelectProps = {
  onChangeValue?: (value?: any) => void,
  value?: any
}