import Combobox from "../ui/combobox";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import ComboboxMultiple from "../ui/combobox-multiple";

const RequirementLevelSelect = (props: RequirementLevelSelectProps) => {
  const { data: session }: any = useSession();
  const {
    value,
    onChangeValue,
    placeholder,
    error: formError,
    companyId,
    className,
    multiple,
    setValues: setValue,
  } = props;

  const { data, isLoading } = useSWR(
    session?.user?.access_token
      ? [
          `/api/requirementlevel/get_all_levels${
            companyId ? `/${companyId}` : ""
          }`,
          session?.user?.access_token,
        ]
      : null,
    fetchApi,
    { revalidateOnFocus: false }
  );

  const contentData = () => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item: any) => {
        return {
          value: item.document_level_id,
          text: (
            <div className="flex gap-2 items-center justify-between w-full">
              <span className="font-medium">{item.document_level_name}</span>
            </div>
          ),
          label: item.document_level_name,
        };
      });
    }
    return;
  };

  const docReqs =
    Array.isArray(data) && data.map((d: any) => d.document_level_id);

  useEffect(() => {
    if (docReqs && setValue) {
      setValue("requirement_levels", docReqs);
    }
  }, [data, docReqs, setValue]);

  if (multiple) {
    return (
      <div className="flex flex-col gap-1">
        <ComboboxMultiple
          isLoading={isLoading}
          value={value}
          onChangeValue={onChangeValue}
          contents={contentData()}
          className="h-10"
          // defaultValue={docReqs}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Combobox
        contents={contentData()}
        placeholder={placeholder}
        value={value}
        onChangeValue={onChangeValue}
        isLoading={isLoading}
        className={cn(className, formError && formErrorClassNames)}
      />
      {formError && <ErrorFormMessage message={formError.message} />}
    </div>
  );
};

type RequirementLevelSelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
  companyId?: any;
  className?: string | undefined;
  multiple?: boolean;
  setValues?: any;
};

export default RequirementLevelSelect;
