import Combobox from "../ui/combobox";
import { formErrorClassNames } from "@/utils/app";
import { cn } from "@/lib/utils";
import ErrorFormMessage from "../app/error-form-message";
import useSWR from "swr";
import { baseUrl, fetchApi, fetcher } from "@/utils/api.config";
import { useSession } from "next-auth/react";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

const CompanySelect = (props: CompanySelectProps) => {
  const { data: session }: any = useSession();
  const { value, onChangeValue, placeholder, error: formError } = props;

  const { data, isLoading, error } = useSWR('/api/cms/get_companies', fetcher, swrOptions);

  const contentData = () => {
    if (data && data.length > 0) {
      return data.map((item: any) => {
        return {
          value: item.company_id,
          text: (
            <div className="flex gap-2 items-center justify-between w-full">
              <span className="font-medium">{item.company_name}</span>
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
        className={cn("py-2 px-2", formError && formErrorClassNames)}
      />
      {formError && <ErrorFormMessage message={formError.message} />}
    </div>
  );
};

type CompanySelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
};

export default CompanySelect;
