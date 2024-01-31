import Combobox from "../ui/combobox";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";

const LANGUAGES = ['English', 'German'];

const DocumentLanguageSelect = (props: DocumentLanguageSelectProps) => {
  const { value, onChangeValue, placeholder, error: formError } = props;

  const contentData = () => {
    return LANGUAGES.map((item: any) => {
      return {
        value: item.toLowerCase(),
        text: (
          <div className="flex gap-2 items-center justify-between w-full">
            <span className="font-medium">{item}</span>
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

type DocumentLanguageSelectProps = {
  value?: any
  onChangeValue?: (value?: any) => void
  placeholder?: any
  error?: any
}

export default DocumentLanguageSelect;