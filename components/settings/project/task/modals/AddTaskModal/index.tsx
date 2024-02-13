import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { TaskForm } from "../../form/TaskForm";

export const AddTaskModal = (props: IAddTaskModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title={data?.task_id ? "Edit Task" : "Add Task"}
    >
      <div className='pb-5 px-7'>
        <TaskForm
          id={data?.task_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type IAddTaskModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
