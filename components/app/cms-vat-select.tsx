import Combobox from "../ui/combobox";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const CmsVatSelect = (props: CmsVatSelectProps) => {
  const { data: session }: any = useSession();
  const { value, onChangeValue, placeholder, cms_id } = props;
  const [isOpenPopover, setIsOpenPopover] = useState(false);
  const [cmsId, setCmsId] = useState(null);

  useEffect(() => {
    setCmsId(cms_id);
  }, [cms_id]);

  const { data, isLoading } = useSWR(
    session?.user?.access_token
      ? [`/api/cms/cms_vats/${cmsId}`, session?.user?.access_token]
      : null,
    fetchApi,
    { revalidateOnFocus: false }
  );

  const contentData = () => {
    if (Array.isArray(data) && data.length > 0) {
      return data.map((vat: any) => {
        return {
          value: vat.cms_vat_id,
          text: (
            <div className="flex gap-2 items-start">
              <div className="flex flex-col">
                <span className="font-medium">
                  {vat.cms_vat_description} ({vat.cms_vat_code})
                </span>
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
      onChangeValue={onChangeValue}
      onOpenChange={(open) => setIsOpenPopover(open)}
    />
  );
};

type CmsVatSelectProps = {
  value?: any;
  onChangeValue?: (value?: any) => void;
  placeholder?: any;
  cms_id?: any;
};

export default CmsVatSelect;
