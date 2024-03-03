import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { DueInvoicesForm } from "../../form/DueInvoicesForm";

export const AddDueInvoicesModal = (props: AddDueInvoicesModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Due Invoices Reminder'>
      <div className='pb-5 px-7'>
        <DueInvoicesForm
          id={data?.invoice_reminder_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type AddDueInvoicesModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
