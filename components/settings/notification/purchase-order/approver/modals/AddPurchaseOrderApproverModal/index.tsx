import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { PurchaseOrderApproverForm } from "../../form/PurchaseOrderApproverForm";

export const AddPurchaseOrderApproverModal = (props: AddPurchaseOrderApproverModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Approver'>
      <div className='pb-5 px-7'>
        <PurchaseOrderApproverForm
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type AddPurchaseOrderApproverModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
