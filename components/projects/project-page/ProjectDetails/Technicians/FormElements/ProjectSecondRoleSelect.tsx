import ComboboxMultiple from "@/components/ui/combobox-multiple";
import React, { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { fetcher } from "@/utils/api.config";
import { useSession } from "next-auth/react";

export const ProjectSecondRoleSelect = (props: ProjectSecondRoleSelectProps) => {
  const { data: session }: any = useSession();
  const { onChangeValue, value, disabled, project_id } = props;

  const { data, isLoading, error, mutate } = useSWR(
    [
      `/api/projects/${project_id}/technician/get_technician_second_role`,
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
            <span className="font-medium">{cms.project_second_role_name}</span>
          </div>
        ),
        value: cms.project_second_role_id,
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <ComboboxMultiple
        placeholder='Choose'
        isLoading={isLoading}
        value={value}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className="h-10"
      />
    </div>
  )
}

type ProjectSecondRoleSelectProps = {
  onChangeValue?: any,
  value?: any,
  disabled?: boolean,
  project_id?: any
}