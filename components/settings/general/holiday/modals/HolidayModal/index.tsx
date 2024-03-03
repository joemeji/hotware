import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { HolidayForm } from "../../form/HolidayForm";

export const HolidayModal = (props: ICountryModal) => {
  const { open, onOpenChange, holiday, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Holiday'>
      <div className='pb-5 px-5'>
        <HolidayForm id={holiday?.holiday_id} listUrl={listUrl} onOpenChange={onOpenChange}/>
      </div>
    </GenericModal>
  );
};

type ICountryModal = {
  open?: boolean
  holiday?: any
  listUrl: string
  onOpenChange?: (open: boolean) => void;
};
