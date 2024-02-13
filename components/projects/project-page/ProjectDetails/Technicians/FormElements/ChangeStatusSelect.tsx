import Combobox from "@/components/ui/combobox";
import React, { useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { fetcher } from "@/utils/api.config";
import { useSession } from "next-auth/react";

export const ProjectTechnicianStatus = (props: ProjectTechnicianStatusProps) => {
  const { data: session }: any = useSession();
  const { onChangeValue, value, disabled } = props;

  const data = [
    {
      id: '1',
      name: 'Official'
    },
    {
      id: '2',
      name: 'Temporary'
    }
  ]

  const contentData = () => {
    return data && data.map((status: any) => {
      return {
        text: (
          <div className="flex flex-col">
            <span className="font-medium">{status.name}</span>
          </div>
        ),
        value: status.id,
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

type ProjectTechnicianStatusProps = {
  onChangeValue?: any,
  value?: any,
  disabled?: boolean
}