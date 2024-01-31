import Combobox from "../ui/combobox";
import useSWR, { preload } from "swr";
import { fetcher } from "@/utils/api.config";
import ErrorFormMessage from "./error-form-message";
import { formErrorClassNames } from "@/utils/app";
import { cn } from "@/lib/utils";
import { useState } from "react";

preload('/api/warehouse', fetcher);

const WarehouseSelect = (props: WarehouseSelectProps) => {
  const { value, onChangeValue, placeholder, error: formError } = props;
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  const { data, isLoading, error, mutate } = useSWR('/api/warehouse', fetcher);

  const contentData = () => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item: any) => {
        return {
          value: item.warehouse_id,
          text: (
            <div className="flex flex-col">
              <span className="font-medium">{item.warehouse_name}</span>
              <span className=" opacity-80">{item.warehouse_location}</span>
            </div>
          )
        }
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
        onOpenChange={open => setIsOpenPopover(open)}
      />
      {formError && (
        <ErrorFormMessage 
          message={formError.message} 
        />
      )}
    </div>
  );
};

type WarehouseSelectProps = {
  value?: any
  onChangeValue?: (value?: any) => void
  placeholder?: any
  error?: any
}

export default WarehouseSelect;