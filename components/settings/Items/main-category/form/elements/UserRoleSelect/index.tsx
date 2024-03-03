import Combobox from "@/components/ui/combobox";
import ComboboxMultiple2 from "@/components/ui/combobox-multiple";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const UserRoleSelect = (props: ILetterDocumentTypeSelect) => {
  const { onChangeValue, value, multiple, setValues: setValue } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR(
    "/api/roles/lists",
    fetcher,
    swrOptions
  );

  const contentData = () => {
    return (
      data &&
      data.length > 0 &&
      data.map((role: any, key: number) => {
        return {
          text: (
            <div key={key}>
              <span className="font-medium">{role.role_name}</span>
            </div>
          ),
          value: role.role_id,
          label: role.role_name,
        };
      })
    );
  };

  const roles = data && data.map((d: any) => d.role_id);

  useEffect(() => {
    if (roles && setValue) {
      setValue("category_roles", roles);
    }
  }, [data, roles, setValue]);

  return (
    <div className="flex flex-col gap-2">
      {multiple && data && (
        <ComboboxMultiple2
          isLoading={isLoading}
          value={value}
          onChangeValue={onChangeValue}
          contents={contentData()}
          className="h-10"
        />
      )}

      {!multiple && data && (
        <Combobox
          isLoading={isLoading}
          value={value}
          onChangeValue={onChangeValue}
          contents={contentData()}
          className="h-10"
        />
      )}
    </div>
  );
};

type ILetterDocumentTypeSelect = {
  onChangeValue?: (value?: any) => void;
  value?: any;
  multiple?: boolean;
  defaultValue?: any;
  setValues?: any;
};
