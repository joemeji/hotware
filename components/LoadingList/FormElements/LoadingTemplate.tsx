import Combobox from "@/components/ui/combobox";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const LoadingTemplateSelect = (props: TypeUnitSelectProps) => {
    const { onChangeValue, value } = props;

    const swrOptions = {
        revalidateOnFocus: false,
        revalidateIfStale: false,
    };

    const { data, isLoading, error } = useSWR('/api/loading-list/loading_template', fetcher, swrOptions);

    console.log(data)
    const contentData = () => {
        return data && data.map((template: any, key: number) => {
            return {
                text: (
                    <div key={key}>
                        <span className="font-medium">{template.loading_template_name}</span>
                    </div>
                ),
                value: template.loading_template_id,
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

type TypeUnitSelectProps = {
    onChangeValue?: (value?: any) => void,
    value?: any
}