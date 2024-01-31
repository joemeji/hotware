import Combobox from "../ui/combobox";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const ApiDocumentLanguageSelect = (props: ApiDocumentLanguageSelectProps) => {
  const { data: session }: any = useSession();
  const {
    value,
    onChangeValue,
    placeholder,
    error: formError,
    className,
  } = props;

  const { data, isLoading } = useSWR(
    session?.user?.access_token
      ? ["/api/document/language/all", session?.user?.access_token]
      : null,
    fetchApi,
    { revalidateOnFocus: false }
  );

  const contentData = () => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item: any) => {
        return {
          value: item.document_language_id,
          text: (
            <div className="flex gap-2 items-center justify-between w-full">
              <span className="font-medium">{item.document_language_name}</span>
            </div>
          ),
        };
      });
    }
    return;
  };

  return (
    <div className="flex flex-col gap-1">
      <Combobox
        contents={contentData()}
        placeholder={placeholder}
        value={value}
        onChangeValue={onChangeValue}
        isLoading={isLoading}
        className={cn("py-2 px-2", className, formError && formErrorClassNames)}
      />
      {formError && <ErrorFormMessage message={formError.message} />}
    </div>
  );
};

type ApiDocumentLanguageSelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
  className?: any;
};

export default ApiDocumentLanguageSelect;
