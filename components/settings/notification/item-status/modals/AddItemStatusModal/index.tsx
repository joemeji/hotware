import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { ItemStatusForm } from "../../form/ItemStatusForm";

export const AddItemStatusModal = (props: AddItemStatusModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Item Status'>
      <div className='pb-5 px-7'>
        <ItemStatusForm
          id={data?.item_status_receiver_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type AddItemStatusModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
