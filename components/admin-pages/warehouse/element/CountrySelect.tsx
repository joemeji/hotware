import Combobox from "../../../ui/combobox";
import useSWR, { preload } from "swr";
import { fetcher } from "@/utils/api.config";
import { formErrorClassNames } from "@/utils/app";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ErrorFormMessage from "../../../app/error-form-message";

const WarehouseCountrySelect = (props: WarehouseCountrySelectProps) => {
  const { value, onChangeValue, placeholder, error: formError } = props;
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  const { data, isLoading, error } = useSWR(`/api/country/all`, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const contentData = () => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item: any) => {
        return {
          value: item.country_name,
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
        className={cn(formError && formErrorClassNames)}
        onOpenChange={(open) => setIsOpenPopover(open)}
      />
      {formError && <ErrorFormMessage message={formError.message} />}
    </div>
  );
};

type WarehouseCountrySelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
};

export default WarehouseCountrySelect;
