

import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { VatForm } from "../../form/VatForm";

export const VatModal = (props: IAddCurrencyModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Value Added Tax'>
      <div className='pb-5 px-7'>
        <VatForm id={data?.vat_id} listUrl={listUrl} onOpenChange={onOpenChange}/>
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
