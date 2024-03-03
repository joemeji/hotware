import Combobox from "../ui/combobox";
import useSWR, { preload } from "swr";
import { baseUrl, fetcher } from "@/utils/api.config";
import { formErrorClassNames } from "@/utils/app";
import { cn } from "@/lib/utils";
import { useState } from "react";
import ErrorFormMessage from "../app/error-form-message";
import { useRouter } from "next/router";

preload(`/api/cms/all/exhibition`, fetcher);

const CountrySelect = (props: CountrySelectProps) => {
  const router = useRouter();
  const { value, onChangeValue, placeholder, error: formError } = props;
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [search, setSearch] = useState("");
  router.query.search = search;
  const { data, isLoading, error } = useSWR(
    `/api/country/all?search=${search}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

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
        className={cn(formError && formErrorClassNames)}
        onOpenChange={(open) => setIsOpenPopover(open)}
        onSearch={(value: any) => setSearch(value)}
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
