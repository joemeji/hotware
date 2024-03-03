import { memo, useState } from "react";
import {
  ActionMenu,
  RoleModuleActionMenu,
  TD,
  TH,
  categoryHeadings,
  tableHeadings,
} from "../..";
import { fetcher } from "@/utils/api.config";
import useSWR from "swr";
import { Loader2 } from "lucide-react";
import { AddRoleModuleForm } from "../../form/AddRoleModuleForm";
import { DeleteRoleModuleConfirmModal } from "../../modals/DeleteRoleModuleConfirmModal";

const RoleModuleLists = (props: any) => {
  const { id, roleModuleData } = props;
  const listUrl = `/api/roles/getAddedModules?id=${id}`;
  const selectionUrl = `/api/roles/getModules?id=${id}`;

  const { data, isLoading, mutate } = useSWR(listUrl, fetcher, {
    revalidateOnFocus: false,
    revalidateIfStale: false,
  });

  const roleModules = data && data;
  const pager = data?.pager;

  const handleDelete = async (data: any) => {
    setSelectedData(data);
    setOpenDeleteConfirm(true);
  };

  const [selectedData, setSelectedData] = useState<any>();
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);

  return (
    <>
      <AddRoleModuleForm listUrl={listUrl} data={roleModuleData}/>
      <DeleteRoleModuleConfirmModal
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
                {roleModules &&
                  roleModules.length > 0 &&
                  roleModules.map((role_module: any, i: number) => {
                    return (
                      <tr key={i} className='&_td:border-r'>
                        <TD>{role_module.module_name.toUpperCase()}</TD>
                        <TD>{role_module.module_description.toUpperCase()}</TD>
                        <TD className="text-right">
                          <RoleModuleActionMenu
                            onDelete={() => handleDelete(role_module)}
                            data={{
                              id: role_module.role_module_id,
                            }}
                          />
                        </TD>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            {!isLoading && roleModules?.length == 0 && (
              <div className='text-center max-w-full p-5'>No records found</div>
            )}

            {isLoading && <Loader2 className='animate-spin mx-auto m-5' />}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(RoleModuleLists);
