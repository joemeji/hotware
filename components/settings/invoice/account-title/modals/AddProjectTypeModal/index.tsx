import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { ProjectTypeForm } from "../../form/ProjectTypeForm";

export const AddProjectTypeModal = (props: AddProjectTypeModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Project Type'>
      <div className='pb-5 px-7'>
        <ProjectTypeForm
          id={data?.project_type_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type AddProjectTypeModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
