import Combobox from "@/components/ui/combobox";
import React, { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { fetcher } from "@/utils/api.config";
import { useSession } from "next-auth/react";

export const ProjectRoleSelect = (props: ProjectRoleSelectProps) => {
  const { data: session }: any = useSession();
  const { onChangeValue, value, disabled, project_id } = props;

  const { data, isLoading, error, mutate } = useSWR(
    [
      `/api/projects/${project_id}/technician/get_technician_role`,
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
            <span className="font-medium">{cms.project_role_name}</span>
          </div>
        ),
        value: cms.project_role_id,
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

type ProjectRoleSelectProps = {
  onChangeValue?: any,
  value?: any,
  disabled?: boolean,
  project_id?: any
}