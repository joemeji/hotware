import Combobox from "../ui/combobox";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";

const ReceiptTotalTypeSelect = (props: VatSelectProps) => {
  const {
    value,
    onChangeValue,
    placeholder,
    error: formError,
    modal = false,
  } = props;

  return (
    <div className="flex flex-col gap-1">
      <Combobox
        modal={modal}
        contents={[
          { value: "1", text: "Amount" },
          { value: "2", text: "Percentage" },
        ]}
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
  modal?: boolean;
};

export default ReceiptTotalTypeSelect;
