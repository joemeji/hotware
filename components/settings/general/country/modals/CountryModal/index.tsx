import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { CountryForm } from "../../form/CountryForm";

export const CountryModal = (props: ICountryModal) => {
  const { open, onOpenChange, id, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Countrys'>
      <div className='pb-5 px-5'>
        <CountryForm id={id} listUrl={listUrl} onOpenChange={onOpenChange}/>
      </div>
    </GenericModal>
  );
};

type ICountryModal = {
  open?: boolean;
  id?: string
  listUrl: string
  onOpenChange?: (open: boolean) => void;
};
