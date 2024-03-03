import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { AdministrativeReminderForm } from "../../form/AdministrativeReminderForm";

export const AddAdministrativeReminderModal = (props: AddAdministrativeReminderModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Administrative Reminder'>
      <div className='pb-5 px-7'>
        <AdministrativeReminderForm
          id={data?.administrative_reminder_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type AddAdministrativeReminderModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
