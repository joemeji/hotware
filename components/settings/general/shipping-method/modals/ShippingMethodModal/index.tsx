

import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { ShippingMethodForm } from "../../form/ShippingMethodForm";

export const ShippingMethodModal = (props: ShippingMethodModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Shipping Method'>
      <div className='pb-5 px-7'>
        <ShippingMethodForm id={data?.shipping_method_id} listUrl={listUrl} onOpenChange={onOpenChange}/>
      </div>
    </GenericModal>
  );
};

type ShippingMethodModal = {
  open?: boolean;
  data?: any
  listUrl: string
  onOpenChange?: (open: boolean) => void;
};
