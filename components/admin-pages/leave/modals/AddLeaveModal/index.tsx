import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { LeaveForm } from "../../form/LeaveForm";

export const AddLeaveModal = (props: AddLeaveModalProps) => {
  const { open, onOpenChange, data, onSuccess } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title="Add Leave">
      <div className="pb-5 px-7">
        <LeaveForm
          selected={data}
          onOpenChange={onOpenChange}
          onSuccess={onSuccess}
        />
      </div>
    </GenericModal>
  );
};

type AddLeaveModalProps = {
  open?: boolean;
  data?: any;
  onSuccess?: () => void;
  onOpenChange?: (open: boolean) => void;
};
