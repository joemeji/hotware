import { memo, useState } from "react";
import {
  ActionMenu,
  DocumentCategoryActionMenu,
  TD,
  TH,
  categoryHeadings,
  tableHeadings,
} from "../..";
import { fetcher } from "@/utils/api.config";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { AddDocumentCategoryForm } from "../../form/AddDocumentCategoryForm";
import { DeleteCategoryConfirmModal } from "../../modals/DeleteCategoryConfirmModal";

const DocumentCategoryLists = (props: any) => {
  const { id, documentLevelData } = props;

  const listUrl = `/api/document/level-categories/all?id=${id}`;

  const { data, isLoading } = useSWR(listUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const documentLevelCategories = data && data;
  const pager = data?.pager;

  const handleDelete = async (data: any) => {
    setSelectedData(data);
    setOpenDeleteConfirm(true);
  };

  const [selectedData, setSelectedData] = useState<any>();
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  return (
    <>
      <AddDocumentCategoryForm listUrl={listUrl} data={documentLevelData} />
      <DeleteCategoryConfirmModal
        data={selectedData}
        open={openDeleteConfirm}
        listUrl={listUrl}
        onOpenChange={setOpenDeleteConfirm}
      />
      <div className='grid bg-white'>
        <div className='mt-10'>
          <div className='min-h-full'>
            <table className='w-full rounded-sm overflow-hidden p-5'>
              <thead>
                <tr>
                  {categoryHeadings.map((heading: any, i: any) => {
                    return (
                      <TH key={i} className={heading?.class}>
                        {heading?.name}
                      </TH>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {documentLevelCategories &&
                  documentLevelCategories.length > 0 &&
                  documentLevelCategories.map((dlc: any, i: number) => {
                    return (
                      <tr key={i} className='text-center &_td:border-r'>
                        <TD>{dlc.document_type_name}</TD>
                        <TD>{dlc.document_category_name}</TD>
                        <TD>
                          <DocumentCategoryActionMenu
                            onDelete={() => handleDelete(dlc)}
                            data={{
                              id: dlc.document_level_id,
                            }}
                          />
                        </TD>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {!isLoading && documentLevelCategories?.length == 0 && (
              <div className='text-center max-w-full p-5'>No records found</div>
            )}

            {isLoading && <Loader2 className='animate-spin mx-auto m-5' />}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(DocumentCategoryLists);
