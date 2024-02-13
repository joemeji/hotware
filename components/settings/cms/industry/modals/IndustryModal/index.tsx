

import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { IndustryForm } from "../../form/InudstryForm";

export const ShippingMethodModal = (props: IAddCurrencyModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Industry'>
      <div className='pb-5 px-7'>
        <IndustryForm id={data?.cms_industry_id} listUrl={listUrl} onOpenChange={onOpenChange}/>
      </div>
    </GenericModal>
  );
};

type IAddCurrencyModal = {
  open?: boolean;
  data?: any
  listUrl: string
  onOpenChange?: (open: boolean) => void;
};
