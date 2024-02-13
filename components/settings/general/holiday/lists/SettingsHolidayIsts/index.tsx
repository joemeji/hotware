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
import { DeleteHolidayConfirmModal } from "../../modals/DeleteHolidayConfirmModal";
import { HolidayModal } from "../../modals/HolidayModal";
import { Tooltip, TooltipProvider } from "@/components/ui/tooltip";

const SettingsHolidayLists = () => {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const onPaginate = (page: any) => {
    setPage(page);
    router.query.page = page;
    router.push(router);
  };

  const listUrl = `/api/holiday/paginate?page=${page}&search=${searchText}`;

  const { data, isLoading } = useSWR(listUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const holidays = data?.holidays;
  const pager = data?.pager;

  const handleDelete = async (data: any) => {
    setSelectedHoliday(data)
    setOpenConfirmDeleteModal(true)
  };

  const handleEdit = (data: any) => {
    setSelectedHoliday(data)
    setOpenHolidayModal(true)
  };

  const [selectedHoliday, setSelectedHoliday] = useState<any>('')
  const [openHoliddayModal, setOpenHolidayModal] = useState(false);
  const [openConfirmDeleteModal, setOpenConfirmDeleteModal] = useState(false);

  return (
    <div className='grid bg-white'> 
      <HolidayModal
        open={openHoliddayModal}
        holiday={selectedHoliday}
        listUrl={listUrl}
        onOpenChange={(open: any) => setOpenHolidayModal(open)}
      />
      <DeleteHolidayConfirmModal
        open={openConfirmDeleteModal}
        holiday={selectedHoliday}
        listUrl={listUrl}
        onOpenChange={(open: any) => setOpenConfirmDeleteModal(open)}
      />
      <div className={cn("bg-white p-7", {})}>
        <div className='flex items-center justify-between '>
          <h1 className='text-2xl font-light mb-5'>Manage Holidays</h1>
          <div className='flex gap-2'>
            <div>
              
            </div>
            <div>
              <Input
                placeholder='Search'
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Button
              variant='red'
              onClick={() => {
                setOpenHolidayModal(true);
                setSelectedHoliday(null);
              }}
            >
              <Plus {...iconProps} />
              Add Holiday 
            </Button>
          </div>
        </div>
      </div>
      <div className='p-3 '>
        <div className='min-h-full'>
          <table className='w-full rounded-sm overflow-hidden p-5 table-auto'>
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
              {holidays &&
                holidays.length > 0 &&
                holidays.map((holiday: any, i: number) => {
                  return (
                    <tr key={i}>
                      <TD className='text-center'>{holiday.holiday_id}</TD>
                      <TD>{holiday.holiday_name}</TD>
                      <TD>{holiday?.holiday_date ?? "--"}</TD>
                      <TD className='text-center'>
                        <p className="line-clamp-2" title={holiday?.country_name}>
                          {holiday.country_id == "0" && "All"}
                          {holiday?.country_name}
                        </p>
                      </TD>
                      <TD className='text-center'>
                        {holiday?.holiday_every_year == "1" ? "Yes" : "No"}
                      </TD>
                      <TD className='text-center'>
                        <ActionMenu
                          onDelete={() =>
                            handleDelete(
                              holiday
                            )
                          }
                          onEdit={() => handleEdit(holiday)}
                          data={{
                            id: holiday.country_id,
                          }}
                        />
                      </TD>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!isLoading && holidays?.length == 0 && (
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

export default memo(SettingsHolidayLists);