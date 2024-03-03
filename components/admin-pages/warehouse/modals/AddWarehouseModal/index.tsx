import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { WarehouseForm } from "../../form/WarehouseForm";

export const AddWarehouseModal = (props: AddWarehouseModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Warehouse'>
      <div className='pb-5 px-7'>
        <WarehouseForm
          id={data?.warehouse_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type AddWarehouseModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
