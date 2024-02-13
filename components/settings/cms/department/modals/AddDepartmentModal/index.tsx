import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { DepartmentForm } from "../../form/DepartmentForm";

export const AddDepartmentModal = (props: IAddCurrencyModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Industry'>
      <div className='pb-5 px-7'>
        <DepartmentForm id={data?.cms_department_id} listUrl={listUrl} onOpenChange={onOpenChange}/>
      </div>
    </GenericModal>
  );
};

type IAddCurrencyModal = {
  open?: boolean;
  data?: any
  listUrl: string
  onOpenChange?: (open: boolean) => void;
};
