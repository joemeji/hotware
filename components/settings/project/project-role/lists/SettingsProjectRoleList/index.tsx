import { memo, useEffect, useState } from "react";
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
import { AddProjectRoleModal } from "../../modals/AddProjectRoleModal";
import { DeleteProjectRoleConfirmModal } from "../../modals/DeleteProjectRoleConfirmModal";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { ProductRoleDocumentModal } from "../../modals/ProductRoleDocumentModal";

interface ISettingsProjectRoleList {
  companySettingValue?: boolean;
  setCompanySettingValue?: any;
}

const SettingsProjectRoleList = (props: ISettingsProjectRoleList) => {
  const { companySettingValue, setCompanySettingValue } = props;

  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const onPaginate = (page: any) => {
    setPage(page);
    router.query.page = page;
    router.push(router);
  };

  const listUrl = `/api/project/project-role/paginate?page=${page}&search=${searchText}`;

  const { data, isLoading } = useSWR(listUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const projectRoles = data?.project_roles;
  const pager = data?.pager;

  const handleDelete = async (data: any) => {
    setSelectedData(data);
    setOpenDeleteConfirm(true);
  };

  const handleEdit = (data: any) => {
    setSelectedData(data);
    setOpenAddModal(true);
  };

  const handleViewProductRoleDoc = (data: any) => {
    setSelectedData(data);
    setOpenProductRoleDocument(true);
  };

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [openProductRoleDocument, setOpenProductRoleDocument] = useState(false);
  const [selectedData, setSelectedData] = useState<any>();

  const handleProjectRoleDocument = async (data: boolean) => {
    setCompanySettingValue(data);

    try {
      const payload = {
        company_setting_value: data,
      };

      const url = "/api/company-settings/enable-project-role-document";

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "Successfully Saved",
          variant: "success",
          duration: 4000,
        });
      } else {
        toast({
          title: json?.error,
          variant: "error",
          duration: 4000,
        });
      }
    } catch {}
  };

  useEffect(() => {
    // setEnableProjectRoleDocument(companySettingValue);
  }, [companySettingValue]);

  return (
    <div className='grid bg-white'>
      <AddProjectRoleModal
        open={openAddModal}
        data={selectedData}
        listUrl={listUrl}
        onOpenChange={(open: any) => setOpenAddModal(open)}
      />
      <DeleteProjectRoleConfirmModal
        open={openDeleteConfirm}
        data={selectedData}
        listUrl={listUrl}
        onOpenChange={(open: any) => setOpenDeleteConfirm(open)}
      />
      <ProductRoleDocumentModal
        open={openProductRoleDocument}
        data={selectedData}
        onOpenChange={(open: any) => setOpenProductRoleDocument(open)}
      />
      <div className={cn("bg-white p-7", {})}>
        <div className='flex items-center justify-between '>
          <div>
            <h1 className='text-2xl font-light mb-5'>Manage Project Roles</h1>
            <div className='flex gap-3 col-span-5 xl:col-span-3 md:col-span-4'>
              <Switch
                checked={companySettingValue}
                onCheckedChange={handleProjectRoleDocument}
              />
              <label className='font-medium'>
                Enable Project Role Documents
              </label>
            </div>
          </div>
          <div className='flex gap-3'>
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
              }}
            >
              <Plus {...iconProps} />
              Add Project Role
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
              {projectRoles &&
                projectRoles.length > 0 &&
                projectRoles.map((role: any, i: number) => {
                  return (
                    <tr key={i} className='text-center &_td:border-r'>
                      <TD>{i + 1}</TD>
                      <TD className='text-left'>{role.project_role_name}</TD>
                      <TD>
                        <ActionMenu
                          hasView={companySettingValue}
                          onDelete={() => handleDelete(role)}
                          onEdit={() => handleEdit(role)}
                          onView={() => handleViewProductRoleDoc(role)}
                          data={{
                            id: role.project_role_name,
                          }}
                        />
                      </TD>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!isLoading && projectRoles?.length == 0 && (
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

export default memo(SettingsProjectRoleList);
