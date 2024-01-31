import Combobox from "../ui/combobox";
import useSWR from "swr";
import { fetcher } from "@/utils/api.config";
import AvatarProfile from "../AvatarProfile";
import { useState } from "react";
import { cn } from "@/lib/utils";

const CmsEmployeeSelect = (props: CmsEmployeeSelectProps) => {
  const { value, onChangeValue, placeholder, cms_id, onChange } = props;
  const [isOpenPopover, setIsOpenPopover] = useState(false);

  const { data, isLoading, error, mutate } = useSWR(
    `/api/cms/${cms_id}/cms_employee`,
    fetcher
  );

  const contentData = () => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((employee: any) => {
        return {
          value: employee.cms_employee_id,
          text: (
            <div
              className={cn(
                "flex gap-2 items-center",
                employee.cms_employee_phone_number && "items-start"
              )}
            >
              <AvatarProfile
                firstname={employee.cms_employee_firstname}
                lastname={employee.cms_employee_lastname}
                avatarColor={employee.avatar_color}
                photo={employee.cms_employee_photo}
                avatarClassName="text-white font-medium"
              />
              <div className="flex flex-col">
                <span className="font-medium">
                  {employee.cms_employee_firstname}{" "}
                  {employee.cms_employee_lastname}
                </span>
                {employee.cms_employee_phone_number && (
                  <span>{employee.cms_employee_phone_number}</span>
                )}
              </div>
            </div>
          ),
        };
      });
    }
    return;
  };

  return (
    <Combobox
      contents={contentData()}
      placeholder={placeholder}
      value={value}
      onChangeValue={(value) => {
        onChangeValue && onChangeValue(value);
        if (Array.isArray(data)) {
          const employee = data.find(
            (item: any) => item.cms_employee_id == value
          );
          onChange && onChange(employee);
        }
      }}
      onOpenChange={(open) => {
        setIsOpenPopover(open);
        mutate(data);
      }}
    />
  );
};

type CmsEmployeeSelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  cms_id?: any;
  onChange?: (employee?: any) => void;
};

export default CmsEmployeeSelect;
