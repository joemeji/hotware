import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { PurchaseOrderNotifierForm } from "../../form/PurchaseOrderNotifierForm";

export const AddPurchaseOrderNotifierModal = (
  props: AddPurchaseOrderNotifierModal
) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title='Project Second Role'
    >
      <div className='pb-5 px-7'>
        <PurchaseOrderNotifierForm
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type AddPurchaseOrderNotifierModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
