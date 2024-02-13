import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { ProjectRoleDocumentForm } from "../../form/ProjectRoleDocumentForm";

export const ProductRoleDocumentModal = (props: IProductRoleDocumentModal) => {
  const { open, onOpenChange, data } = props;

  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title='Project Role'
      subTitle={data?.project_role_name}
    >
      <div className='pb-10'>
        <ProjectRoleDocumentForm
          id={data?.project_role_id}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type IProductRoleDocumentModal = {
  open?: boolean;
  data?: any;
  onOpenChange?: (open: boolean) => void;
};
