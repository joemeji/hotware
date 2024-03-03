import Combobox from "../ui/combobox";
import useSWR, { preload } from "swr";
import { fetcher } from "@/utils/api.config";
import { formErrorClassNames } from "@/utils/app";
import { cn } from "@/lib/utils";
import { useContext, useState } from "react";
import ErrorFormMessage from "../app/error-form-message";
import { CmsDetailsContext } from "@/pages/address-manager/[cms_id]";

const AddressSelect = (props: AddressSelectProps) => {
  const { value, onChangeValue, placeholder, error: formError } = props;
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const cms: any = useContext(CmsDetailsContext);

  const { data, isLoading, error } = useSWR(
    `/api/cms/${cms?._cms_id}/all_address`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const address = (row: any) => {
    const adds = [
      row.cms_address_street || null,
      row.cms_address_province || null,
      row.cms_address_city || null,
      row.cms_address_zip || null,
      row.country_name || null,
    ];

    return adds.filter((text: any) => text !== null).join(", ");
  };

  const contentData = () => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item: any) => {
        return {
          value: item.cms_address_id,
          text: (
            <div className="flex gap-2 items-center justify-between w-full">
              <span className="font-medium">{address(item)}</span>
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

type AddressSelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
};

export default AddressSelect;
