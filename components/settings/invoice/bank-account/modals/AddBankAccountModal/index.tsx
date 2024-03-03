import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { BankAccountForm } from "../../form/BankAccountForm";

export const AddBankAccountModal = (props: AddBankAccountModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Bank Account'>
      <div className='pb-5 px-7'>
        <BankAccountForm
          id={data?.ba_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type AddBankAccountModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
