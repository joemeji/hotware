import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { ProjectSecondRoleDocumentForm } from "../../form/ProjectSecondRoleDocumentForm";

export const ProjectSecondRoleDocumentModal = (
  props: ProjectSecondRoleDocument
) => {
  const { open, onOpenChange, data } = props;

  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title='Project Role'
      subTitle={data?.project_second_role_name}
    >
      <div className='pb-10'>
        <ProjectSecondRoleDocumentForm
          id={data?.project_second_role_id}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type ProjectSecondRoleDocument = {
  open?: boolean;
  data?: any;
  onOpenChange?: (open: boolean) => void;
};
