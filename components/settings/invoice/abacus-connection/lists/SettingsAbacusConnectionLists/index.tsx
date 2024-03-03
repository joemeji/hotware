import { memo, useState } from "react";
import { ActionMenu, TD, TH, tableHeadings } from "../..";
import { fetcher } from "@/utils/api.config";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { iconProps } from "@/components/admin-layout/sidebar/general-settings/general-settings-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Pagination from "@/components/pagination";
import { AddAbacusConnectionModal } from "../../modals/AddAbacusConnectionModal";
import { DeleteAbacusConnectionConfirmModal } from "../../modals/DeleteAbacusConnectionConfirmModal";
import { PER_PAGE } from "@/utils/algoliaConfig";

const SettingsAbacusConnectionLists = () => {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const onPaginate = (page: any) => {
    setPage(page);
    router.query.page = page;
    router.push(router);
  };

  const listUrl = `/api/invoice/abacus-connection/paginate?page=${page}&search=${searchText}`;

  const { data, isLoading } = useSWR(listUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const abacus_connection = data?.abacus_connection;
  const pager = data?.pager;

  const handleDelete = async (data: any) => {
    setSelectedData(data);
    setOpenDeleteConfirm(true);
  };

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedData, setSelectedData] = useState<any>();

  return (
    <div className='grid bg-white'>
      <AddAbacusConnectionModal
        open={openAddModal}
        data={selectedData}
        listUrl={listUrl}
        onOpenChange={(open: any) => setOpenAddModal(open)}
      />
      <DeleteAbacusConnectionConfirmModal
        open={openDeleteConfirm}
        data={selectedData}
        listUrl={listUrl}
        onOpenChange={(open: any) => setOpenDeleteConfirm(open)}
      />
      <div className={cn("bg-white p-7", {})}>
        <div className='flex items-center justify-between '>
          <h1 className='text-2xl font-light mb-5'>Manage Abacus Connection</h1>
          <div className='flex gap-2'>
            <div>
              <Input
                placeholder='Search'
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Button
              variant='red'
              onClick={() => {
                setOpenAddModal(true);
                setSelectedData(null);
              }}
            >
              <Plus {...iconProps} />
              Add Abacus Connection
            </Button>
          </div>
        </div>
      </div>
      <div className='p-3'>
        <div className='min-h-full'>
          <table className='w-full rounded-sm overflow-hidden p-5'>
            <thead>
              <tr>
                {tableHeadings.map((heading: any, i: any) => {
                  return (
                    <TH key={i} className={heading?.class}>
                      {heading?.name}
                    </TH>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {abacus_connection &&
                abacus_connection.length > 0 &&
                abacus_connection.map((company: any, i: number) => {
                  return (
                    <tr key={i} className='text-center &_td:border-r'>
                      <TD>{(page - 1) * PER_PAGE + i + 1}</TD>
                      <TD className='text-left'>
                        {company.company_name}
                      </TD>
                      <TD className='text-center'>
                        {company.is_abacus_number}
                      </TD>
                      <TD className='text-center'>
                        {company.currency}
                      </TD>
                      <TD>
                        <ActionMenu
                          onDelete={() => handleDelete(company)}
                          data={{
                            id: company.company_id,
                          }}
                        />
                      </TD>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!isLoading && abacus_connection?.length == 0 && (
            <div className='text-center max-w-full p-5'>No records found</div>
          )}

          {isLoading && <Loader2 className='animate-spin mx-auto m-5' />}

          {pager && (
            <div className='mt-auto border-t border-t-stone-100 flex justify-end'>
              <Pagination pager={pager} onPaginate={onPaginate} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default memo(SettingsAbacusConnectionLists);
