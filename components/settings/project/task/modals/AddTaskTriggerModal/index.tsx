import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { Button } from "@/components/ui/button";
import { TaskTriggerForm } from "../../form/TaskTriggerForm";

export const AddTaskTriggerModal = (props: IAddTaskTriggerModal) => {
  const { open, onOpenChange, data } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Add Trigger'>
      <div className='p-5'>
        <TaskTriggerForm data={data} />
      </div>
    </GenericModal>
  );
};

type IAddTaskTriggerModal = {
  open?: boolean;
  data?: any;
  onOpenChange?: (open: boolean) => void;
};
