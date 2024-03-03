import unitTypes from "@/utils/unitTypes";
import Combobox from "../ui/combobox";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";

const ItemUnitSelect = (props: ItemUnitSelectProps) => {
  const { value, onChangeValue, placeholder, error: formError } = props;

  const contentData = () => {
    if (Array.isArray(unitTypes) && unitTypes.length > 0) {
      return unitTypes.map((unitType: any) => {
        return {
          value: unitType,
          text: (
            <div className="flex gap-2 items-center justify-between w-full">
              <span className="font-medium">{unitType}</span>
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

type ItemUnitSelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
};

export default ItemUnitSelect;
