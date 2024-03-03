import { memo, useState } from "react";
import { fetchApi } from "@/utils/api.config";
import useSWR from "swr";
import { useRouter } from "next/router";
import { CalendarIcon, ListIcon, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { iconProps } from "@/components/admin-layout/sidebar/general-settings/general-settings-menu";
import { cn } from "@/lib/utils";
import { AddLeaveModal } from "../../modals/AddLeaveModal";
import { AddCategoryModal } from "../../modals/AddCategoryModal";
import { useSession } from "next-auth/react";
import { DatePicker } from "@/components/ui/datepicker";
import Combobox from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import dayjs from "dayjs";
import { ListView } from "../../tabs/ListView";
import { CalendarView } from "../../tabs/CalendarView";

const TABS = {
  LIST: "list",
  CALENDAR: "calendar",
};

const LeaveLists = () => {
  const { data: session }: any = useSession();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [openAddLeaveModal, setOpenAddLeaveModal] = useState(false);
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false);
  const [tab, setTab] = useState(TABS.LIST);
  const [selectedData, setSelectedData] = useState<any>();
  const [search, setSearch] = useState({
    excuse_from_filter: null,
    excuse_to_filter: null,
    excuse_arrange_by: "excuse_date",
    excuse_sort_by: "ASC",
    search: "",
    previous_holidays: false,
  });
  const searchObject: any = Object.fromEntries(
    Object.entries(search)
      .filter(([_, v]) => v)
      .map(([field, v]) => {
        if (field === "excuse_from_filter" || field === "excuse_to_filter") {
          return [field, dayjs(v as any).format("YYYY-MM-DD")];
        }

        return [field, v];
      })
  );
  const searchQuery = new URLSearchParams({ ...searchObject, page }).toString();

  const setQuery = (field: string, value: any) => {
    setSearch((search) => ({ ...search, [field]: value }));
    setPage(1);
  };

  const onPaginate = (page: any) => {
    setPage(page);
    router.query.page = page;
    router.push(router);
  };

  const { data, isLoading, mutate } = useSWR(
    session?.user?.access_token
      ? ["/api/leaves?" + searchQuery, session?.user?.access_token]
      : null,
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const leaves = data?.leaves;
  const total_days_applied = data?.total_days_applied || 0;
  const pager = data?.pager;

  const handleEdit = (data: any) => {
    setSelectedData(data);
    setOpenAddLeaveModal(true);
  };

  return (
    <div className="grid bg-white">
      <AddLeaveModal
        open={openAddLeaveModal}
        data={selectedData}
        onSuccess={() => {
          setSelectedData(null);
          mutate();
        }}
        onOpenChange={(open: any) => setOpenAddLeaveModal(open)}
      />
      <AddCategoryModal
        open={openAddCategoryModal}
        data={selectedData}
        onOpenChange={(open: any) => setOpenAddCategoryModal(open)}
      />

      <div className={cn("bg-white p-7", {})}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-light mb-5">Manage Leave</h1>
          <div className="flex gap-5">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setTab(TABS.LIST)}
                className={`${
                  tab === TABS.LIST ? "bg-[#18181b] text-white" : "bg-[#f1f2f7]"
                } p-2 rounded-md`}
              >
                <ListIcon {...iconProps} />
              </button>
              <button
                onClick={() => setTab(TABS.CALENDAR)}
                className={`${
                  tab === TABS.CALENDAR
                    ? "bg-[#18181b] text-white"
                    : "bg-[#f1f2f7]"
                } p-2 rounded-md`}
              >
                <CalendarIcon {...iconProps} />
              </button>
            </div>
            <div className="flex gap-2.5">
              <Button
                variant="red"
                onClick={() => {
                  setOpenAddLeaveModal(true);
                  setSelectedData(null);
                }}
              >
                <Plus {...iconProps} />
                Add Leave
              </Button>
              <Button
                variant="default"
                onClick={() => {
                  setOpenAddCategoryModal(true);
                  setSelectedData(null);
                }}
              >
                {/* <Plus {...iconProps} /> */}
                Categories
              </Button>
            </div>
          </div>
        </div>
        {tab === TABS.LIST ? (
          <div className="flex flex-col gap-2.5 w-full mt-6">
            <div className="flex gap-2.5">
              <div className="flex-1">
                <label className="block mb-2">From</label>
                <DatePicker
                  triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center h-10"
                  date={search?.excuse_from_filter as any}
                  onChangeDate={(date: any) =>
                    setQuery("excuse_from_filter", date)
                  }
                  format="yyyy-MM-dd"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-2">Arrange By</label>
                <Combobox
                  contents={[
                    { value: "excuse_date", text: "Date" },
                    { value: "excuse_category", text: "Category" },
                    { value: "user_fullname", text: "Technician" },
                    { value: "excuse_reason", text: "Reason" },
                    { value: "country_name", text: "Country" },
                    { value: "excuse_status", text: "Status" },
                    { value: "excuse_approver", text: "Reviewed By" },
                  ]}
                  value={search?.excuse_arrange_by || "excuse_date"}
                  className="h-10"
                  onChangeValue={(value) =>
                    setQuery("excuse_arrange_by", value)
                  }
                />
              </div>
              <div className="flex-1">
                <div className="flex mb-2">
                  <label className="flex-1 block">Search</label>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="previous_holidays"
                      className="rounded-none w-[17px] h-[17px]"
                      defaultChecked={search?.previous_holidays || false}
                      onCheckedChange={(value: any) =>
                        setQuery("previous_holidays", value)
                      }
                    />
                    <label htmlFor="previous_holidays">
                      Include previous holidays
                    </label>
                  </div>
                </div>
                <Input
                  className="bg-stone-100 border-transparent"
                  placeholder="Search"
                  value={search?.search || ""}
                  onChange={(e) => setQuery("search", e.target.value)}
                />
              </div>
            </div>
            <div className="flex gap-2.5">
              <div className="flex-1">
                <label className="block mb-2">To</label>
                <DatePicker
                  triggerClassName="bg-stone-100 w-full py-2 px-3 rounded-md items-center h-10"
                  date={search?.excuse_to_filter as any}
                  onChangeDate={(date: any) =>
                    setQuery("excuse_to_filter", date)
                  }
                  format="yyyy-MM-dd"
                />
              </div>
              <div className="flex-1">
                <label className="block mb-2">Sort By</label>
                <Combobox
                  contents={[
                    { value: "ASC", text: "Ascending" },
                    { value: "DESC", text: "Descending" },
                  ]}
                  value={search?.excuse_sort_by || "ASC"}
                  className="h-10"
                  onChangeValue={(value) => setQuery("excuse_sort_by", value)}
                />
              </div>
              <div className="flex-1">
                <label className="block mb-2">
                  Total Days Applied (Per page):
                </label>
                <Input
                  className="bg-stone-100 border-transparent"
                  placeholder="Search"
                  readOnly
                  value={
                    total_days_applied
                      ? `${total_days_applied} ${
                          total_days_applied > 1 ? "days" : "day"
                        }`
                      : ""
                  }
                />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      {tab === TABS.LIST ? (
        <ListView
          leaves={leaves}
          onUpdate={mutate}
          isLoading={isLoading}
          pager={pager}
          onPaginate={onPaginate}
          handleEdit={handleEdit}
          canApprove={session?.user?.role_id <= 2 ?? false}
        />
      ) : (
        <CalendarView />
      )}
    </div>
  );
};

export default memo(LeaveLists);
