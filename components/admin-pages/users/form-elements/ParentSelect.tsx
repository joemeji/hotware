import Combobox from "@/components/ui/combobox";
import React from "react";

const status = [
  {
    name: "Mother"
  },
  {
    name: "Father"
  }
];

export const ParentSelect = (props: ParentSelectProps) => {
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
        onSelectedItem={value}
      />
    </div>
  )
}

type ParentSelectProps = {
  onChangeValue?: (value?: any) => void,
  value?: any
}