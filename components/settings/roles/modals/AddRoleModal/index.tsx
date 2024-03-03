import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { RoleForm } from "../../form/RoleForm";

export const AddRoleModal = (props: AddRoleModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title='Role'
    >
      <div className='pb-5 px-7'>
        <RoleForm
          id={data?.role_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type AddRoleModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
