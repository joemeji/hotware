import ComboboxMultiple from "@/components/ui/combobox-multiple";
import React, { useEffect, useState } from "react";
import useSWR, { useSWRConfig } from "swr";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { fetcher } from "@/utils/api.config";
import { useSession } from "next-auth/react";

export const ScopeOfWorkSelect = (props: ScopeOfWorkSelectProps) => {
  const { data: session }: any = useSession();
  const { onChangeValue, value, disabled, project_id } = props;

  const { data, isLoading, error, mutate } = useSWR(
    [
      `/api/projects/${project_id}/technician/getAddedScopes`,
      session.user.access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const contentData = () => {
    return (
      data &&
      data.map((scope: any) => {
        const scopeName = scope.project_scope_name.replace(/<br\s*\/?>/g, "");
        return {
          text: (
            <div className="flex flex-col">
              <span className="font-medium">{scopeName}</span>
            </div>
          ),
          value: scope.project_scope_id,
          label: scopeName,
        };
      })
    );
  };

  return (
    <div className="flex flex-col gap-2">
      <ComboboxMultiple
        isLoading={isLoading}
        value={value}
        onChangeValue={onChangeValue}
        contents={contentData()}
        className="h-10"
      />
    </div>
  );
};

type ScopeOfWorkSelectProps = {
  onChangeValue?: any;
  value?: any;
  disabled?: boolean;
  project_id?: any;
};
