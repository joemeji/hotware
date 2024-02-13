import Combobox from "@/components/ui/combobox";
import React, { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { fetcher } from "@/utils/api.config";
import { useSession } from "next-auth/react";

export const SupplierSelect = (props: SupplierSelectProps) => {
  const { data: session }: any = useSession();
  const { onChangeValue, value, disabled, cms_id } = props;

  const { data, isLoading, error, mutate } = useSWR(
    [
      `/api/cms/get_cms_by_category/2`,
      session.user.access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const contentData = () => {
    return data && data.map((cms: any) => {
      return {
        text: (
          <div className="flex flex-col">
            <span className="font-medium">{cms.cms_name}</span>
          </div>
        ),
        value: cms.cms_id,
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
      // disabled={disabled}
      />
    </div>
  )
}

type SupplierSelectProps = {
  onChangeValue?: any,
  value?: any,
  disabled?: boolean,
  cms_id?: any
}