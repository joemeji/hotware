import Combobox from "../ui/combobox";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { formErrorClassNames } from "@/utils/app";
import ErrorFormMessage from "./error-form-message";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react"

const ProjectTypeSelect = (props: ProjectTypeSelectProps) => {
  const { data: session }: any = useSession();
  const { value, onChangeValue, placeholder, error: formError } = props;

  const { data, isLoading } = useSWR(
    session?.user?.access_token ?
      ['/api/projects/types', session?.user?.access_token] :
      null,
    fetchApi,
    { revalidateOnFocus: false }
  );

  const contentData = () => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((item: any) => {
        return {
          value: item.project_type_id,
          text: (
            <div className="flex gap-2 items-center justify-between w-full">
              <span className="font-medium">{item.project_type_name}</span>
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
        isLoading={isLoading}
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

type ProjectTypeSelectProps = {
  value?: any
  onChangeValue?: (value?: any) => void
  placeholder?: any
  error?: any
}

export default ProjectTypeSelect;