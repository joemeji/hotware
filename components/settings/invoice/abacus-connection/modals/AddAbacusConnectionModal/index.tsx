import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { AbacusConnectionForm } from "../../form/AbacusConnectionForm";

export const AddAbacusConnectionModal = (props: AddAbacusConnectionModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Abacus Connection'>
      <div className='pb-5 px-7'>
        <AbacusConnectionForm
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type AddAbacusConnectionModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
