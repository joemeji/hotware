import Combobox from "@/components/ui/combobox";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const RoleSelect = (props: RoleSelectProps) => {
  const { onChangeValue, value } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR('/api/user/get_roles', fetcher, swrOptions);

  const contentData = () => {
    return data && data.map((role: any, key: number) => {
      return {
        text: (
          <div key={key}>
            <span className="font-medium">{role.role_name}</span>
          </div>
        ),
        value: role.role_id,
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

type RoleSelectProps = {
  onChangeValue?: (value?: any) => void,
  value?: any
}