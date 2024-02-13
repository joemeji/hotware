import { memo, useState } from "react";
import { ActionMenu, TD, TH, archiveHeadings, tableHeadings } from "../..";
import { fetcher } from "@/utils/api.config";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";
import { Archive, Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { iconProps } from "@/components/admin-layout/sidebar/general-settings/general-settings-menu";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Pagination from "@/components/pagination";
import { AddTaskModal } from "../../modals/AddTaskModal";
import { DeleteTaskConfirmModal } from "../../modals/DeletePositionConfirmModal";
import { TaskArchivesModal } from "../../modals/TaskArchivesModal";
import { AddTaskTriggerModal } from "../../modals/AddTaskTriggerModal";

const SettingsTaskList = () => {
  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const onPaginate = (page: any) => {
    setPage(page);
    router.query.page = page;
    router.push(router);
  };

  const listUrl = `/api/project/task/paginate?page=${page}&search=${searchText}`;

  const { data, isLoading } = useSWR(listUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const tasks = data?.tasks;
  const pager = data?.pager;

  const handleDelete = async (data: any) => {
    setSelectedData(data);
    setOpenDeleteConfirm(true);
  };

  const handleEdit = (data: any) => {
    setSelectedData(data);
    setOpenAddModal(true);
  };

  const handleAddTaskTrigger = (data: any) => {
    setSelectedData(data);
    setOpenTaskTriggerModal(true);
  };

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openArchiveModal, setOpenArchiveModal] = useState(false);
  const [openTaskTriggerModal, setOpenTaskTriggerModal] = useState(false);
  const [selectedData, setSelectedData] = useState<any>();

  return (
    <div className='grid bg-white'>
      <AddTaskModal
        open={openAddModal}
        data={selectedData}
        listUrl={listUrl}
        onOpenChange={(open: any) => setOpenAddModal(open)}
      />
      <DeleteTaskConfirmModal
        open={openDeleteConfirm}
        data={selectedData}
        listUrl={listUrl}
        onOpenChange={(open: any) => setOpenDeleteConfirm(open)}
      />
      <TaskArchivesModal
        open={openArchiveModal}
        onOpenChange={(open: any) => setOpenArchiveModal(open)}
      />
      <AddTaskTriggerModal
        open={openTaskTriggerModal}
        data={selectedData}
        onOpenChange={(open: any) => setOpenTaskTriggerModal(open)}
      />
      <div className={cn("bg-white p-7", {})}>
        <div className='flex items-center justify-between '>
          <div>
            <h1 className='text-2xl font-light mb-5'>Manage Tasks</h1>
            <p className='tex-xs text-gray-400'>
              <strong>Note :</strong>
              <i>
                Only the TEMPLATE Tasks and the AUTOMATED Tasks will be
                displayed here.
              </i>
            </p>
          </div>
          <div className='flex gap-2'>
            <div>
              <Input
                placeholder='Search'
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <Button
              variant='default'
              onClick={() => {
                setOpenArchiveModal(true);
              }}
            >
              <Archive {...iconProps} />
              Task Archives
            </Button>
            <Button
              variant='red'
              onClick={() => {
                setOpenAddModal(true);
                setSelectedData(null);
              }}
            >
              <Plus {...iconProps} />
              Add Task
            </Button>
          </div>
        </div>
      </div>
      <div className='p-3'>
        <div className='min-h-full'>
          <table className='w-full rounded-sm overflow-hidden p-5'>
            <thead>
              <tr className='uppercase text-center'>
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
              {tasks &&
                tasks.length > 0 &&
                tasks.map((task: any, i: number) => {
                  return (
                    <tr key={i} className='text-center &_td:border-r'>
                      <TD>{task.task_name}</TD>
                      <TD className='text-left'>{task.task_description}</TD>
                      <TD>{task.task_category}</TD>
                      <TD>{task.due_date}</TD>
                      <TD>{task.task_priority_level}</TD>
                      <TD>{task.task_status}</TD>
                      <TD>
                        <ActionMenu
                          onDelete={() => handleDelete(task)}
                          onEdit={() => handleEdit(task)}
                          onAddTaskTrigger={() => handleAddTaskTrigger(task)}
                          data={{
                            id: task.cms_position_id,
                          }}
                        />
                      </TD>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!isLoading && tasks?.length == 0 && (
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

export default memo(SettingsTaskList);
