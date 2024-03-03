import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { RequirementForm } from "../../form/RequirementForm";

export const AddRequirementModal = (props: AddRequirementModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Document Category'>
      <div className='pb-5 px-7'>
        <RequirementForm
          id={data?.document_category_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type AddRequirementModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
