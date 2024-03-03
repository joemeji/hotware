import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import RoleModuleLists from "../../lists/RoleModuleLists";

export const AddRoleModuleModal = (props: AddRoleModuleModal) => {
  const { open, onOpenChange, data } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Add Module'>
      <div className='pb-5 px-7'>
        <RoleModuleLists
          id={data?.role_id}
          roleModuleData={data}
        />
      </div>
    </GenericModal>
  );
};

type AddRoleModuleModal = {
  open?: boolean;
  data?: any;
  onOpenChange?: (open: boolean) => void;
};
