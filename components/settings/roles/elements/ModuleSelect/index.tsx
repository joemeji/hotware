import Combobox from "@/components/ui/combobox";
import { fetcher } from "@/utils/api.config";
import React from "react";
import useSWR from "swr";

export const ModuleSelect = (props: ModuleSelect) => {
  const { id, onChangeValue, value } = props;
  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR(
    `/api/roles/getModules?id=${id}`,
    fetcher,
    swrOptions
  );

  const contentData = () => {
    return (
      data &&
      data.length > 0 &&
      data.map((type: any, key: number) => {
        return {
          text: (
            <div key={key}>
              <span className="font-medium">{type.module_name.toUpperCase()} ({type.module_description.toUpperCase()})</span>
            </div>
          ),
          value: type.module_id,
        };
      })
    );
  };

  const _onChangeValue = (value?: any) => {
    onChangeValue && onChangeValue(value);
    const docType =
      Array.isArray(data) &&
      data.find((item: any) => item.module_id == value);
  };

  return (
    <div className="flex flex-col gap-2">
      <Combobox
        value={value}
        onChangeValue={_onChangeValue}
        contents={contentData()}
        className="h-10"
      />
    </div>
  );
};

type ModuleSelect = {
  id?:any,
  onChangeValue?: (value?: any) => void;
  value?: any;
};
