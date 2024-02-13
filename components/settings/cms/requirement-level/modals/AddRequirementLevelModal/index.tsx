import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { RequirementLevelForm } from "../../form/RequirementLevelForm";

export const AddRequirementLevelModal = (props: IAddRequirementLevelModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title='Requirement Level'
    >
      <div className='pb-5 px-7'>
        <RequirementLevelForm
          id={data?.document_level_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type IAddRequirementLevelModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
