import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { TechnicianDocumentForm } from "../../form/TechnicianDocumentForm";

export const AddTechnicianDocumentModal = (props: AddTechnicianDocumentModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Technician Document Reminder'>
      <div className='pb-5 px-7'>
        <TechnicianDocumentForm
          id={data?.notification_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type AddTechnicianDocumentModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
