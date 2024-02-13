import Combobox from "@/components/ui/combobox";
import React, { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { fetcher } from "@/utils/api.config";
import { useSession } from "next-auth/react";

export const CompanySelect = (props: CompanySelectProps) => {
  const { data: session }: any = useSession();
  const { onChangeValue, value, disabled } = props;

  const { data, isLoading, error, mutate } = useSWR(
    [
      `/api/company/all`,
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
            <span className="font-medium">{cms.company_name}</span>
          </div>
        ),
        value: cms.company_id,
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

type CompanySelectProps = {
  onChangeValue?: any,
  value?: any,
  disabled?: boolean
}