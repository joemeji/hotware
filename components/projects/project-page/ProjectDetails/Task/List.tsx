import AvatarProfile from "@/components/AvatarProfile";
import MoreOption from "@/components/MoreOption";
import { ItemMenu, TD, TH } from "@/components/items";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AccessTokenContext } from "@/context/access-token-context";
import { cn } from "@/lib/utils";
import { ProjectDetailsContext } from "@/pages/projects/[project_id]";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { ChevronDown, MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useContext, useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import AssignTaskModal from "./modals/AssignTaskModal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";

export default function List({
  isUpdated,
  onEditTask,
}: {
  isUpdated?: boolean | any;
  onEditTask?: (task: any) => void;
}) {
  const access_token = useContext(AccessTokenContext);
  const project = useContext(ProjectDetailsContext);
  const [page, setPage] = useState(1);
  const payload: any = { page };
  const queryString = new URLSearchParams(payload).toString();
  const [openAssignTaskModal, setOpenAssignTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [deleteItemLoading, setDeleteItemloading] = useState(false);
  const [toDeleteItem, setToDeleteItem] = useState<any>(null);
  const [deleteError, setDeleteError] = useState<any>(null);

  const { data, isLoading, error, mutate } = useSWR(
    [
      project.data?._project_id
        ? `/api/projects/${project.data?._project_id}/task?${queryString}`
        : null,
      access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const onAssignTask = (task: any) => {
    setOpenAssignTaskModal(true);
    setSelectedTask(task);
  };

  const onCloseAlert = () => {
    setToDeleteItem(null);
    setOpenAlertMessage(false);
    setDeleteItemloading(false);
    setDeleteError(null);
  };

  const onForceDeleteTask = async () => {
    const formData = new FormData();
    try {
      formData.append("task_id", toDeleteItem.parent_task_id);

      setDeleteItemloading(true);
      const response = await fetch(
        `${baseUrl}/api/projects/${project?.data?._project_id}/task/delete`,
        {
          headers: authHeaders(access_token, true),
          method: "POST",
          body: formData,
        }
      );
      const json = await response.json();
      if (json.message) {
        setDeleteError(json.message);
        setToDeleteItem(null);
      }
      if (json.success) {
        setDeleteItemloading(false);
        setToDeleteItem(null);
        setOpenAlertMessage(false);
        const toastPayload: any = {
          title: "Task has been deleted successfully.",
          variant: "success",
          duration: 2000,
        };
        toast(toastPayload);
        mutate(data);
      }
    } catch (err: any) {
      console.log(err);
      setDeleteItemloading(false);
    }
  };

  useEffect(() => {
    if (isUpdated) {
      mutate(data);
    }
  }, [isUpdated, mutate, data]);

  return (
    <>
      <AssignTaskModal
        open={openAssignTaskModal}
        onOpenChange={(open: any) => setOpenAssignTaskModal(open)}
        task={selectedTask}
        onUpdated={() => mutate(data)}
      />

      <AlertDialog
        open={openAlertMessage}
        // onOpenChange={(open) => {
        //   setOpenAlertMessage(open);
        //   if (!open) {
        //     setToDeleteItem(null);
        //   }
        // }}
      >
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle>
              {deleteError ? deleteError?.title : "Are you sure?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {deleteError ? (
                deleteError?.description
              ) : (
                <div className="flex flex-col">
                  <span>
                    Are you sure you want to delete {toDeleteItem?.task_name}?
                  </span>
                  <span>{"You won't be able to revert this."}</span>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCloseAlert}>Cancel</AlertDialogCancel>
            {toDeleteItem && (
              <AlertDialogAction
                disabled={deleteItemLoading}
                onClick={() => {
                  toDeleteItem && onForceDeleteTask();
                }}
              >
                Delete
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="rounded-b-xl overflow-hidden bg-background min-h-[300px]">
        <table className="w-full">
          <thead>
            <tr>
              <TH className="ps-4">Task</TH>
              <TH>Assigned User</TH>
              <TH>Priority</TH>
              <TH>Due Date</TH>
              <TH>Finished Date</TH>
              <TH>Remarks</TH>
              <TH>Status</TH>
              <TH className="pe-4 text-right">Actions</TH>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data?.list) && data.list.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center opacity-70 py-3">
                  No records found.
                </td>
              </tr>
            )}
            {(project.isLoading || isLoading) &&
              Array.from({ length: 6 }).map((item: any, key: number) => (
                <tr key={key}>
                  <TD>
                    <div className="flex flex-col gap-2">
                      <Skeleton className="w-[300px] h-[15px]" />
                      <Skeleton className="w-[100px] h-[15px]" />
                    </div>
                  </TD>
                  <TD>
                    <div className="flex items-center gap-2">
                      <Skeleton className="w-[40px] h-[40px] rounded-full" />
                    </div>
                  </TD>
                  <TD>
                    <Skeleton className="w-[100px] h-[15px]" />
                  </TD>
                  <TD>
                    <Skeleton className="w-[100px] h-[15px]" />
                  </TD>
                  <TD>
                    <Skeleton className="w-[120px] h-[15px]" />
                  </TD>
                  <TD>
                    <Skeleton className="w-[100px] h-[15px]" />
                  </TD>
                  <TD>
                    <Skeleton className="w-[100px] h-[15px]" />
                  </TD>
                  <TD></TD>
                </tr>
              ))}
            {Array.isArray(data?.list) &&
              data.list.map((item: any, key: number) => (
                <tr key={key} className="hover:bg-stone-100">
                  <TD className="ps-4">
                    <div className="flex flex-col">
                      <p className="font-medium">{item.task_name}</p>
                      <p
                        dangerouslySetInnerHTML={{
                          __html: item.task_description,
                        }}
                        className="opacity-70"
                      />
                    </div>
                  </TD>
                  <TD className="align-top">
                    <AssignedUsers
                      users={item.assigned_users}
                      onUpdated={() => mutate(data)}
                    />
                  </TD>

                  <TD className="font-medium align-top">
                    {item.task_priority_level}
                  </TD>
                  <TD className="align-top">{item.due_date}</TD>
                  <TD className="align-top">{item.task_finished_date}</TD>
                  <TD className="align-top">{item.task_remarks}</TD>
                  <TD className="align-top">
                    {<Status consent={item.task_status} />}
                  </TD>
                  <TD className="pe-4 text-right align-top">
                    {item.task_status === "active" && (
                      <div className="flex items-center gap-2 justify-end">
                        <Button
                          className="py-1 px-2"
                          variant={"outline"}
                          onClick={() => onAssignTask(item)}
                        >
                          Assign Task
                        </Button>
                        <MoreOption
                          menuTriggerChildren={
                            <Button className="py-1 px-2" variant={"secondary"}>
                              <MoreHorizontal className="w-[18px]" />
                            </Button>
                          }
                        >
                          <ItemMenu
                            className="flex gap-3 items-center"
                            onClick={() => onEditTask && onEditTask(item)}
                          >
                            <Pencil className="w-[18px]" />
                            <span className="font-medium">Edit</span>
                          </ItemMenu>
                          <ItemMenu
                            className="flex gap-3 items-center"
                            onClick={() => {
                              setToDeleteItem(item);
                              setOpenAlertMessage(true);
                            }}
                          >
                            <Trash className="w-[18px]" />
                            <span className="font-medium">Delete</span>
                          </ItemMenu>
                        </MoreOption>
                      </div>
                    )}
                  </TD>
                </tr>
              ))}
          </tbody>
        </table>

        {data?.pager && (
          <Pagination
            pager={data.pager}
            onPaginate={(p: any) => setPage(p)}
            currPage={page}
          />
        )}
      </div>
    </>
  );
}

const AssignedUsers = ({
  users,
  onUpdated,
}: {
  users?: any;
  onUpdated?: () => void;
}) => {
  const length = 2;
  const access_token = useContext(AccessTokenContext);
  const projectDetails = useContext(ProjectDetailsContext);

  const onRemove = async (user: any) => {
    const formData = new FormData();

    formData.append("technician_id", user.user_id);

    try {
      const response = await fetch(
        `${baseUrl}/api/projects/${projectDetails?.data?._project_id}/task/remove_assigned_user/${user?.task_trigger_id}`,
        {
          headers: authHeaders(access_token, true),
          method: "POST",
          body: formData,
        }
      );
      const json = await response.json();
      if (json.success) {
        onUpdated && onUpdated();
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <div className="flex gap-[2px]">
      {Array.isArray(users) && (
        <>
          {users.slice(0, length).map((item: any, key: number) => (
            <TooltipProvider delayDuration={300} key={key}>
              <Tooltip>
                <TooltipTrigger>
                  <AvatarProfile
                    key={key}
                    firstname={item.user_firstname}
                    lastname={item.user_lastname}
                    photo={baseUrl + "/users/thumbnail/" + item.user_photo}
                    avatarClassName="w-8 h-8"
                    avatarColor={item.avatar_color}
                    avatarFallbackClassName="font-medium text-white text-xs"
                  />
                </TooltipTrigger>
                <TooltipContent>
                  <p>
                    {(item.user_firstname || "N") +
                      " " +
                      (item.user_lastname || "A")}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}
          {users.length > 0 ? (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="font-medium rounded-full h-8 px-2"
                >
                  {users.length - users.slice(0, length).length > 0 ? (
                    "+" + (users.length - users.slice(0, length).length)
                  ) : (
                    <ChevronDown className="w-[16px]" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="p-0">
                <div className="flex flex-col">
                  <p className="text-base font-medium mb-1 pt-2 ps-2">
                    Assigned Users
                  </p>
                  {users.map((item: any, key: number) => (
                    <div
                      key={key}
                      className="flex items-center gap-2 hover:bg-stone-100 p-2 pe-1"
                    >
                      <AvatarProfile
                        firstname={item.user_firstname}
                        lastname={item.user_lastname}
                        photo={baseUrl + "/users/thumbnail/" + item.user_photo}
                        avatarClassName="w-8 h-8"
                        avatarColor={item.avatar_color}
                        avatarFallbackClassName="font-medium text-white text-xs"
                      />
                      <p>
                        {item.user_firstname} {item.user_lastname}
                      </p>

                      <MoreOption
                        menuTriggerChildren={
                          <Button
                            className="py-1 px-2 ms-auto"
                            variant={"ghost"}
                          >
                            <MoreHorizontal
                              strokeWidth={1.5}
                              className="w-[17px]"
                            />
                          </Button>
                        }
                      >
                        <ItemMenu
                          className="flex gap-3 items-center"
                          onClick={() => onRemove(item)}
                        >
                          <span className="font-medium">Remove</span>
                        </ItemMenu>
                      </MoreOption>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          ) : (
            <p>Not yet assigned</p>
          )}
        </>
      )}
    </div>
  );
};

const Status = ({ consent }: { consent?: "active" | "done" }) => {
  let consentColor = useMemo(() => {
    let color: string = "";
    if (consent === "done") color = "22, 163, 74";
    if (consent === "active") color = "253, 186, 116";

    return color;
  }, [consent]);

  if (!consentColor) return <></>;

  const label: any = {
    active: "Pending",
    done: "Done",
  };

  return (
    <div
      className={cn(
        "bg-[rgba(var(--bg-hover))] text-white w-fit px-3 py-[2px] rounded-full",
        "flex items-center font-medium text-[12px]"
      )}
      ref={(el) => {
        el?.style.setProperty("--bg-hover", consentColor);
      }}
    >
      {consent && label[consent]}
    </div>
  );
};
