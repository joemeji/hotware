

import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { PositionForm } from "../../form/PositionForm";

export const AddPositionModal = (props: IAddPositionModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Position'>
      <div className='pb-5 px-7'>
        <PositionForm id={data?.cms_position_id} listUrl={listUrl} onOpenChange={onOpenChange}/>
      </div>
    </GenericModal>
  );
};

type IAddPositionModal = {
  open?: boolean;
  data?: any
  listUrl: string
  onOpenChange?: (open: boolean) => void;
};
