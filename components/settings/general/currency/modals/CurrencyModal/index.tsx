

import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { CurrencyForm } from "../../form/CurrencyForm";

export const CurrencyModal = (props: IAddCurrencyModal) => {
  const { open, onOpenChange, id, listUrl } = props;


  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Currency'>
      <div className='pb-2 px-10'>
        <CurrencyForm id={id} listUrl={listUrl} onOpenChange={onOpenChange}/>
      </div>
    </GenericModal>
  );
};

type IAddCurrencyModal = {
  open?: boolean;
  id?: string
  listUrl: string
  onOpenChange?: (open: boolean) => void;
};
