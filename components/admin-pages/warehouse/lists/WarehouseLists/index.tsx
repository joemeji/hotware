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
import { AddWarehouseModal } from "../../modals/AddWarehouseModal";
import { DeleteWarehouseConfirmModal } from "../../modals/DeleteWarehouseModal";

const WarehouseLists = () => {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const onPaginate = (page: any) => {
    setPage(page);
    router.query.page = page;
    router.push(router);
  };
  
  const listUrl = `/api/admin/warehouse/paginate?page=${page}&search=${searchText}`;

  const { data, isLoading } = useSWR(listUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const warehouse = data?.warehouse;
  const pager = data?.pager;

  const handleDelete = async (data: any) => {
    setSelectedData(data);
    setOpenDeleteConfirm(true);
  };

  const handleEdit = (data: any) => {
    setSelectedData(data);
    setOpenAddModal(true);
  };

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [selectedData, setSelectedData] = useState<any>();

  return (
    <div className='grid bg-white'>
      <AddWarehouseModal
        open={openAddModal}
        data={selectedData}
        listUrl={listUrl}
        onOpenChange={(open: any) => setOpenAddModal(open)}
      />
      <DeleteWarehouseConfirmModal
        open={openDeleteConfirm}
        data={selectedData}
        listUrl={listUrl}
        onOpenChange={(open: any) => setOpenDeleteConfirm(open)}
      />
      <div className={cn("bg-white p-7", {})}>
        <div className='flex items-center justify-between '>
          <h1 className='text-2xl font-light mb-5'>Manage Warehouse</h1>
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
              Add Warehouse
            </Button>
          </div>
        </div>
      </div>
      <div className='p-3'>
        <div className='min-h-full'>
          <table className='w-full mt-4'>
            <thead>
              <tr>
                {tableHeadings.map((heading: any, i: any) => {
                  return (
                    <TH key={i}>
                      {heading?.name}
                    </TH>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {warehouse &&
                warehouse.length > 0 &&
                warehouse.map((warehouse: any, i: number) => {
                  return (
                    <tr key={i} className='even:bg-stone-50 hover:bg-stone-100'>
                      <TD>{warehouse.warehouse_name}</TD>
                      <TD>{warehouse.warehouse_location ? warehouse.warehouse_location + ', ' : ''}{warehouse.warehouse_country}</TD>
                      <TD className='text-left'>
                        {warehouse.company_name}
                      </TD>
                      <TD>
                        <ActionMenu
                          onDelete={() => handleDelete(warehouse)}
                          onEdit={() => handleEdit(warehouse)}
                          data={{
                            id: warehouse.warehouse_id,
                          }}
                        />
                      </TD>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!isLoading && warehouse?.length == 0 && (
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

export default memo(WarehouseLists);
