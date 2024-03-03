import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { LoadingTypeForm } from "../../form/LoadingTypeForm";

export const AddLoadingTypeModal = (props: AddLoadingTypeModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Loading Type'>
      <div className='pb-5 px-7'>
        <LoadingTypeForm
          id={data?.loading_type_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type AddLoadingTypeModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
