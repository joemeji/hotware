import Combobox from "@/components/ui/combobox";
import { fetcher } from "@/utils/api.config";
import React, { useEffect, useState } from "react";
import useSWR from "swr";

export const DocumentTypeSelect = (props: IDocumentTypeSelect) => {
  const { onChangeValue, value, onChangeDocType } = props;

  const swrOptions = {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  };

  const { data, isLoading, error } = useSWR(
    "/api/document/type/all ",
    fetcher,
    swrOptions
  );

  const contentData = () => {
    return (
      data &&
      data.length > 0 &&
      data.map((type: any, key: number) => {
        return {
          text: (
            <div key={key}>
              <span className="font-medium">{type.document_type_name}</span>
            </div>
          ),
          value: type.document_type_id,
        };
      })
    );
  };

  const _onChangeValue = (value?: any) => {
    onChangeValue && onChangeValue(value);
    const docType =
      Array.isArray(data) &&
      data.find((item: any) => item.document_type_id == value);
    onChangeDocType && onChangeDocType(docType);
  };

  return (
    <div className="flex flex-col gap-2">
      <Combobox
        value={value}
        onChangeValue={_onChangeValue}
        contents={contentData()}
        className="h-10"
      />
    </div>
  );
};

type IDocumentTypeSelect = {
  onChangeValue?: (value?: any) => void;
  onChangeDocType?: (docType?: any) => void;
  value?: any;
};
