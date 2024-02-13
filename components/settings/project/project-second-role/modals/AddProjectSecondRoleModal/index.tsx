import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { ProjectSecondRoleForm } from "../../form/ProjectSecondRoleForm";

export const AddProjectSecondRoleModal = (
  props: IAddProjectSecondRoleModal
) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title='Project Second Role'
    >
      <div className='pb-5 px-7'>
        <ProjectSecondRoleForm
          id={data?.project_second_role_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type IAddProjectSecondRoleModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
