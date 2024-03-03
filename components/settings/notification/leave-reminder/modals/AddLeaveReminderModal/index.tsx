import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { LeaveReminderForm } from "../../form/LeaveReminderForm";

export const AddLeaveReminderModal = (props: AddLeaveReminderModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Leave Reminder'>
      <div className='pb-5 px-7'>
        <LeaveReminderForm
          id={data?.excuse_receiver_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type AddLeaveReminderModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
