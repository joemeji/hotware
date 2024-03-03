import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { LoadingWorkForm } from "../../form/LoadingWorkForm";

export const AddLoadingWorkModal = (props: AddLoadingWorkModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Loading Work'>
      <div className='pb-5 px-7'>
        <LoadingWorkForm
          id={data?.loading_work_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type AddLoadingWorkModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
