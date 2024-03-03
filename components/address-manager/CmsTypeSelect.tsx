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

const CmsTypeSelect = (props: CmsTypeSelectProps) => {
  const { data: session }: any = useSession();
  const { value, onChangeValue, placeholder, error: formError } = props;

  const { data, isLoading, error } = useSWR('/api/cms/get_categories', fetcher, swrOptions);

  console.log({ category: data });

  const contentData = () => {
    if (data && data.categories.length > 0) {
      return data.categories.map((item: any) => {
        return {
          value: item.cms_category_id,
          text: (
            <div className="flex gap-2 items-center justify-between w-full">
              <span className="font-medium">{item.cms_category_name}</span>
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
        className={cn(formError && formErrorClassNames)}
      />
      {formError && <ErrorFormMessage message={formError.message} />}
    </div>
  );
};

type CmsTypeSelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
};

export default CmsTypeSelect;
