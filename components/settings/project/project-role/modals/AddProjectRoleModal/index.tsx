import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { ProjectRoleForm } from "../../form/ProjectRoleForm";

export const AddProjectRoleModal = (props: IAddProjectRoleModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Project Role'>
      <div className='pb-5 px-7'>
        <ProjectRoleForm
          id={data?.project_role_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type IAddProjectRoleModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
