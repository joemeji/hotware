import Combobox from "../ui/combobox";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

const VatSelect = (props: VatSelectProps) => {
  const { data: session }: any = useSession();
  const { value, onChangeValue, placeholder, error: formError, modal = false } = props;

  const { data, isLoading } = useSWR(
    session?.user?.access_token
      ? ["/api/vats", session?.user?.access_token]
      : null,
    fetchApi,
    { revalidateOnFocus: false }
  );

  const contentData = () => {
    if (Array.isArray(data) && data.length > 0) {
      const list = [{ vat_id: '0', vat_description: 'No VAT' }, ...data];
      return list.map((item: any) => {
        return {
          value: item.vat_id,
          text: (
            <div className="flex gap-2 items-center justify-between w-full">
              <span className="font-medium">{item.vat_description} {item.vat_percentage ? `(${item.vat_percentage}%)` : ''} </span>
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
        modal={modal}
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

type VatSelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
  modal?: boolean
};

export default VatSelect;
