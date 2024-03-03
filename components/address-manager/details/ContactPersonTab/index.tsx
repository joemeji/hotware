import { CmsDetailsContext } from "@/pages/address-manager/[cms_id]";
import { memo, useContext, useState } from "react";
import { Separator } from "@/components/ui/separator";
import Heading from "./Heading";
import Filter from "./Filter";
import { ItemMenu, TD, TH } from "@/components/items";
import Image from "next/image";
import { authHeaders, baseUrl, fetcher } from "@/utils/api.config";
import useSWR from "swr";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import MoreOption from "@/components/MoreOption";
import { Check, Pencil, Trash } from "lucide-react";
import Pagination from "@/components/pagination";
import dynamic from "next/dynamic";
import { AccessTokenContext } from "@/context/access-token-context";
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

const NewContactPersonModal = dynamic(
  () => import("./modals/NewContactPersonModal")
);

const ContactPersonTab = () => {
  const cms: any = useContext(CmsDetailsContext);
  const access_token: any = useContext(AccessTokenContext);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState<any>(null);
  const [department, setDepartment] = useState<any>(0);
  const [position, setPosition] = useState<any>(0);
  const [openContactFormModal, setOpenContactFormModal] = useState(false);
  const [editContact, setEditContact] = useState(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<any>(false);
  const [loadingDeleteBtn, setLoadingDeleteBtn] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const queryString = new URLSearchParams({
    page: String(page),
    search: search,
    department: department,
    position: position,
  }).toString();

  let { data, isLoading, error, mutate } = useSWR(
    `/api/cms/${cms?._cms_id}/employee?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const onClickEdit = (contact: any) => {
    setEditContact(contact);
    setOpenContactFormModal(true);
  };

  const onSetDefault = async (contact: any) => {
    try {
      let url = `${baseUrl}/api/cms/employee/update/${cms?._cms_id}/${contact.cms_employee_id}`;

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify({ cms_employee_is_default: 1 }),
        headers: authHeaders(access_token),
      });
      const json = await res.json();
      if (json.success) {
        mutate(data);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const onDelete = async (contact: any) => {
    setSelectedContact(contact);
    setOpenDeleteAlert(true);
  };

  const onForceDelete = async () => {
    setLoadingDeleteBtn(true);
    try {
      let url = `${baseUrl}/api/cms/employee/delete/${selectedContact?.cms_employee_id}`;

      const res = await fetch(url, {
        method: "POST",
        headers: authHeaders(access_token),
      });
      const json = await res.json();
      if (json.success) {
        mutate(data);
        toast({
          title: "Contact successfully deleted.",
          variant: "success",
          duration: 1000,
        });
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoadingDeleteBtn(false);
    }
  };

  return (
    <>
      <NewContactPersonModal
        open={openContactFormModal}
        onOpenChange={(open: any) => {
          setOpenContactFormModal(open);
          if (!open) setEditContact(null);
        }}
        onSuccess={() => mutate(data)}
        contact={editContact}
      />

      <AlertDialog
        open={openDeleteAlert}
        onOpenChange={(open: any) => {
          setOpenDeleteAlert(open);
          if (!open) setSelectedContact(null);
        }}
      >
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {"You won't be able to revert this."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loadingDeleteBtn}
              onClick={() => setOpenDeleteAlert(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onForceDelete}
              disabled={loadingDeleteBtn}
              className={cn(loadingDeleteBtn && "loading")}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex flex-col gap-3 border rounded-xl">
        <div className="pt-4 px-4 flex flex-col">
          <Heading onClickCreateContact={() => setOpenContactFormModal(true)} />

          <Separator className="my-2" />

          <Filter
            onSearch={(evt: any) => setSearch(evt)}
            onDepartment={(evt: any) => setDepartment(evt)}
            onPosition={(evt: any) => setPosition(evt)}
          />
        </div>

        <>
          <table className="w-full">
            <thead>
              <tr>
                <TH className="ps-4">#</TH>
                <TH>Name</TH>
                <TH>Phone</TH>
                <TH>Mobile</TH>
                <TH>Department</TH>
                <TH>City</TH>
                <TH></TH>
                <TH className="text-right">Actions</TH>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data?.employees) &&
                data.employees.length === 0 && (
                  <tr>
                    <td colSpan={8}>
                      <div className="flex justify-center">
                        <Image
                          src="/images/No data-rafiki.svg"
                          width={300}
                          height={300}
                          alt="No Data to Shown"
                        />
                      </div>
                    </td>
                  </tr>
                )}
              {isLoading && (
                <tr>
                  <td className="p-2 pt-4 text-center" colSpan={8}>
                    <div className="flex flex-col gap-2 items-center">
                      <Skeleton className="w-[250px] h-[20px]" />
                      <Skeleton className="w-[100px] h-[20px]" />
                    </div>
                  </td>
                </tr>
              )}
              {Array.isArray(data?.employees) &&
                data.employees.map((row: any, key: number) => (
                  <tr className="group hover:bg-stone-100" key={key}>
                    <TD className="font-medium ps-4">
                      {data.offset + key + 1}
                    </TD>
                    <TD className="group-last:border-b-0">
                      <div className="flex flex-col gap-1">
                        <span className="font-medium">
                          {row.cms_employee_fullname}
                        </span>
                        <span>{row.cms_employee_email}</span>
                      </div>
                    </TD>
                    <TD className="group-last:border-b-0">
                      {row.cms_employee_phone_number}
                    </TD>
                    <TD className="group-last:border-b-0">
                      {row.cms_employee_mobile_number}
                    </TD>
                    <TD className="group-last:border-b-0">
                      {row.cms_department_name}
                    </TD>
                    <TD className="group-last:border-b-0">
                      {row.cms_employee_city}
                    </TD>
                    <TD className="group-last:border-b-0">
                      <div className="flex justify-end">
                        {row.cms_employee_is_default == 1 && (
                          <div
                            className={cn(
                              "bg-green-600 text-white w-fit px-2 py-[1px] text-[11px] rounded-full",
                              "flex items-center"
                            )}
                          >
                            Default
                          </div>
                        )}
                      </div>
                    </TD>
                    <TD className="text-right group-last:border-b-0">
                      <MoreOption>
                        <ItemMenu
                          className="gap-3"
                          onClick={() => onClickEdit(row)}
                        >
                          <Pencil className="w-[18px] h-[18px] text-blue-500" />
                          <span className="font-medium">Edit</span>
                        </ItemMenu>
                        {(!row.cms_employee_is_default ||
                          row.cms_employee_is_default == 0) && (
                          <ItemMenu
                            className="gap-3"
                            onClick={() => onSetDefault(row)}
                          >
                            <Check
                              className="w-[18px] h-[18px] text-green-500"
                              strokeWidth={3}
                            />
                            <span className="font-medium">Set as Default</span>
                          </ItemMenu>
                        )}
                        <ItemMenu
                          className="gap-3"
                          onClick={() => onDelete(row)}
                        >
                          <Trash className="w-[18px] h-[18px] text-red-500" />
                          <span className="font-medium">Delete</span>
                        </ItemMenu>
                      </MoreOption>
                    </TD>
                  </tr>
                ))}
            </tbody>
          </table>
          {data && data.pager && (
            <div className="mt-auto border-t border-t-stone-100">
              <Pagination
                pager={data.pager}
                onPaginate={(page: any) => setPage(page)}
                currPage={page}
              />
            </div>
          )}
        </>
      </div>
    </>
  );
};

export default memo(ContactPersonTab);
