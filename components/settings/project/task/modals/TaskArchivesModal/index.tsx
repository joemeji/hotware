import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import TaskArchivesList from "../../lists/TaskArchivesList";

export const TaskArchivesModal = (props: ITaskArchivesModal) => {
  const { open, onOpenChange } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Task Archives'>
      <div className='pb-5 px-7'>
        <TaskArchivesList />
      </div>
    </GenericModal>
  );
};

type ITaskArchivesModal = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};
