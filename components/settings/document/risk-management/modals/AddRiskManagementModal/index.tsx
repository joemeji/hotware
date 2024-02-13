import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { RiskManagementForm } from "../../form/RiskManagementForm";

export const AddRiskManagementModal = (props: IAddRiskManagementModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title='Risk Management'
    >
      <div className='pb-5 px-7'>
        <RiskManagementForm
          id={data?.risk_management_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type IAddRiskManagementModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
