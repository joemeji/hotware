import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { ItemStockForm } from "../../form/ItemStockForm";

export const AddItemStockModal = (props: AddItemStockModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Item Stock Reminder'>
      <div className='pb-5 px-7'>
        <ItemStockForm
          id={data?.item_stock_receiver_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type AddItemStockModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
