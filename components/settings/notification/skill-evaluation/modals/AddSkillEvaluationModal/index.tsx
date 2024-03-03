import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { SkillEvaluationForm } from "../../form/SkillEvaluationForm";

export const AddSkillEvaluationModal = (props: AddSkillEvaluationModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Skill Evaluation Reminder'>
      <div className='pb-5 px-7'>
        <SkillEvaluationForm
          id={data?.notification_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type AddSkillEvaluationModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
