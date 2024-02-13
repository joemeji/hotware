import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import DocumentCategoryLists from "../../lists/DocumentCategoryLists";

export const AddDocumentCategoryModal = (props: IAddDocumentCategoryModal) => {
  const { open, onOpenChange, data } = props;

  return (
    <GenericModal open={open} onOpenChange={onOpenChange} title='Add Document'>
      <div className='pb-5 px-7'>
        <DocumentCategoryLists
          id={data?.document_level_id}
          documentLevelData={data}
        />
      </div>
    </GenericModal>
  );
};

type IAddDocumentCategoryModal = {
  open?: boolean;
  data?: any;
  onOpenChange?: (open: boolean) => void;
};
