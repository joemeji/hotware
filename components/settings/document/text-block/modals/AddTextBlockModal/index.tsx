import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { TextBlockForm } from "../../form/TextBlockForm";

export const AddTextBlockModal = (props: IAddCurrencyModal) => {
  const { open, onOpenChange, data, listUrl } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Text Block'>
      <div className='pb-5 px-7'>
        <TextBlockForm
          id={data?.text_block_id}
          listUrl={listUrl}
          onOpenChange={onOpenChange}
        />
      </div>
    </GenericModal>
  );
};

type IAddCurrencyModal = {
  open?: boolean;
  data?: any;
  listUrl: string;
  onOpenChange?: (open: boolean) => void;
};
