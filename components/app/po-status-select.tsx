import Combobox from "../ui/combobox";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";

const STATUS = [
  { id: "active", label: "OPEN" },
  { id: "approval", label: "FOR APPROVAL" },
  { id: "approved", label: "APPROVED (No Approver)" },
];

const PoStatusSelect = (props: PoStatusSelectProps) => {
  const { value, onChangeValue, placeholder, error: formError } = props;

  const contentData = () => {
    return STATUS.map((item: any) => {
      return {
        value: item.id,
        text: (
          <div className="flex gap-2 items-center justify-between w-full">
            <span className="font-medium">{item.label}</span>
          </div>
        ),
      };
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
      {formError && <ErrorFormMessage message={formError.message} />}
    </div>
  );
};

type PoStatusSelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  error?: any;
};

export default PoStatusSelect;
