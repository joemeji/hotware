import useSWR, { mutate } from "swr";
import { fetcher } from "@/utils/api.config";
import { TD, TH, tableRolesHeadings } from "../..";
import { ActionMenu } from "../../roles";
import { toast } from "@/components/ui/use-toast";

export const UpdateCategoryRolesList = ({ categoryId }: any) => {
  const { data: categoriesRoles, isLoading } = useSWR(
    "/api/item/main-category/roles/lists?categoryId=" + categoryId,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const handleDelete = async (id: string) => {
    const response = await fetch(
      `/api/item/main-category/roles/delete?categoryId=${id}`
    );

    try {
      const res = await fetch(
        "/api/item/main-category/roles/delete?categoryId=" + id,
        {
          method: "POST",
        }
      );

      const json = await res.json();
      if (json && json.success) {
        mutate(`/api/item/main-category/roles/lists?categoryId=${categoryId}`);
        toast({
          title: "Successfully Added",
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

  return (
    <div className="p-3 h-96">
      <div className="min-h-full">
        <table className="w-full rounded-sm overflow-hidden p-5">
          <thead>
            <tr>
              {tableRolesHeadings.map((heading: any, i: any) => {
                return (
                  <TH key={i} className={heading?.class}>
                    {heading?.name}
                  </TH>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <TD>Loading</TD>
              </tr>
            )}
            {categoriesRoles &&
              categoriesRoles.length > 0 &&
              categoriesRoles.map((cRoles: any, i: number) => {
                return (
                  <tr key={i} className="text-center">
                    <TD>{++i}</TD>
                    <TD>{cRoles.item_main_category_name}</TD>
                    <TD>{cRoles.role_name}</TD>
                    <TD>
                      <ActionMenu
                        onDelete={handleDelete}
                        data={{
                          categoryId: cRoles.item_main_category_role_id,
                        }}
                      />
                    </TD>
                  </tr>
                );
              })}
          </tbody>
        </table>
        {!isLoading && categoriesRoles?.length == 0 && (
          <div className="text-center max-w-full p-5">No records found</div>
        )}
      </div>
    </div>
  );
};
