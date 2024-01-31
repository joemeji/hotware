import Combobox from "../ui/combobox";
import useSWR, { preload } from "swr";
import { baseUrl, fetcher } from "@/utils/api.config";
import { formErrorClassNames } from "@/utils/app";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ErrorFormMessage from "../app/error-form-message";

preload(`/api/cms/all/exhibition`, fetcher);

const CountrySelect = (props: CountrySelectProps) => {
  const { value, onChangeValue, placeholder, error: formError } = props;
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  const { data, isLoading, error } = useSWR(`${baseUrl}/country/all`, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const contentData = () => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item: any) => {
        return {
          value: item.country_id,
          text: (
            <div className="flex gap-2 items-center justify-between w-full">
              <span className="font-medium">{item.country_name}</span>
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
        className={cn("py-2 px-2", formError && formErrorClassNames)}
        onOpenChange={(open) => setIsOpenPopover(open)}
      />
      {formError && <ErrorFormMessage message={formError.message} />}
    </div>
  );
};

type CountrySelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
};

export default CountrySelect;
