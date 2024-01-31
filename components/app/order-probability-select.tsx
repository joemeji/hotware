import Combobox from "../ui/combobox";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";

const PROBABILITIES = [
  { id: '10', label: '10%'},
  { id: '20', label: '20%'},
  { id: '30', label: '30%'},
  { id: '40', label: '40%'},
  { id: '50', label: '50%'},
  { id: '60', label: '60%'},
  { id: '70', label: '70%'},
  { id: '80', label: '80%'},
  { id: '90', label: '90%'},
  { id: '100', label: '100%'},
]

const OrderProbabilitySelect = (props: OrderProbabilitySelectProps) => {
  const { value, onChangeValue, placeholder, error: formError } = props;

  const contentData = () => {
    return PROBABILITIES.map((item: any) => {
      return {
        value: item.id,
        text: (
          <div className="flex gap-2 items-center justify-between w-full">
            <span className="font-medium">{item.label}</span>
          </div>
        )
      }
    });
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
      {formError && (
        <ErrorFormMessage
          message={formError.message}
        />
      )}
    </div>
  );
};

type OrderProbabilitySelectProps = {
  value?: any
  onChangeValue?: (value?: any) => void
  placeholder?: any
  error?: any
}

export default OrderProbabilitySelect;