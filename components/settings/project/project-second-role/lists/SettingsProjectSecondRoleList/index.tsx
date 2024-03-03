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
import { AddProjectSecondRoleModal } from "../../modals/AddProjectSecondRoleModal";
import { DeleteProjectSecondRoleConfirmModal } from "../../modals/DeleteProjectRoleConfirmModal";
import { ProjectSecondRoleDocumentModal } from "../../modals/ProjectSecondRoleDocumentModal";
import { PER_PAGE } from "@/utils/algoliaConfig";

interface ISettingsProjectSecondRoleList {
  companySettingValue?: boolean;
  setCompanySettingValue?: any;
}

const SettingsProjectSecondRoleList = (
  props: ISettingsProjectSecondRoleList
) => {
  const { companySettingValue, setCompanySettingValue } = props;

  const router = useRouter();

  const [searchText, setSearchText] = useState("");
  const [page, setPage] = useState(1);

  const onPaginate = (page: any) => {
    setPage(page);
    router.query.page = page;
    router.push(router);
  };

  const listUrl = `/api/project/project-second-role/paginate?page=${page}&search=${searchText}`;

  const { data, isLoading } = useSWR(listUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const projectSecondRoles = data?.project_second_roles;
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
  const [openProductSecondRoleDocument, setOpenProductSecondRoleDocument] =
    useState(false);
  const [selectedData, setSelectedData] = useState<any>();

  const handleViewProductRoleDoc = (data: any) => {
    setSelectedData(data);
    setOpenProductSecondRoleDocument(true);
  };

  return (
    <div className='grid bg-white'>
      <AddProjectSecondRoleModal
        open={openAddModal}
        data={selectedData}
        listUrl={listUrl}
        onOpenChange={(open: any) => setOpenAddModal(open)}
      />
      <DeleteProjectSecondRoleConfirmModal
        open={openDeleteConfirm}
        data={selectedData}
        listUrl={listUrl}
        onOpenChange={(open: any) => setOpenDeleteConfirm(open)}
      />
      <ProjectSecondRoleDocumentModal
        open={openProductSecondRoleDocument}
        data={selectedData}
        onOpenChange={(open: any) => setOpenProductSecondRoleDocument(open)}
      />
      <div className={cn("bg-white p-7", {})}>
        <div className='flex items-center justify-between '>
          <h1 className='text-2xl font-light mb-5'>
            Manage Project Second Roles
          </h1>
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
              Add Project Second Role
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
              {projectSecondRoles &&
                projectSecondRoles.length > 0 &&
                projectSecondRoles.map((role: any, i: number) => {
                  return (
                    <tr key={i} className='text-center &_td:border-r'>
                      <TD>{(page - 1) * PER_PAGE + i + 1}</TD>
                      <TD className='text-left'>
                        {role.project_second_role_name}
                      </TD>
                      <TD>
                        <ActionMenu
                          onDelete={() => handleDelete(role)}
                          onEdit={() => handleEdit(role)}
                          onView={() => handleViewProductRoleDoc(role)}
                          hasView={companySettingValue}
                          data={{
                            id: role.project_second_role_name,
                          }}
                        />
                      </TD>
                    </tr>
                  );
                })}
            </tbody>
          </table>
          {!isLoading && projectSecondRoles?.length == 0 && (
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

export default memo(SettingsProjectSecondRoleList);
