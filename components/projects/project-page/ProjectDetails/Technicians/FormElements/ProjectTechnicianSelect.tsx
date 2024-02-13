import Combobox from "@/components/ui/combobox";
import React, { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { fetcher } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export const ProjectTechnicianSelect = (props: ProjectTechnicianSelectProps) => {
  const { onChangeValue, value, disabled, company_id, project_id, user_service_id, user_skill_id } = props;
  const router = useRouter();
  const _project_id = router.query.project_id;
  const { data: session }: any = useSession();
  const payload: any = {
    user_service_id: user_service_id !== undefined && user_service_id !== null ? user_service_id : 0,
    user_skill_id: user_skill_id !== undefined && user_skill_id !== null ? user_skill_id : 0
  };
  const queryString = new URLSearchParams(payload).toString();
  const { data, isLoading, error, mutate } = useSWR(
    [
      company_id ? `/api/projects/${project_id}/technician/get_by_company/${company_id}?${queryString}` : null,
      session.user.access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const contentData = () => {
    return data && data.map((technician: any) => {
      return {
        text: (
          <div className="flex flex-col">
            <span className="font-medium">{technician.user_firstname} {technician.user_lastname} {technician.rating === 0 ? '(No Rating)' : `(${technician.rating})`}</span>
          </div>
        ),
        value: technician.user_id,
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

type ProjectTechnicianSelectProps = {
  onChangeValue?: any,
  value?: any,
  disabled?: boolean,
  company_id?: any,
  project_id?: any,
  user_service_id?: any,
  user_skill_id?: any
}