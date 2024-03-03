import { ScrollArea } from "@/components/ui/scroll-area";
import { AccessTokenContext } from "@/context/access-token-context";
import { fetchApi } from "@/utils/api.config";
import { Loader2, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/router";
import { memo, useContext, useState } from "react";
import useSWR from "swr";
import { DeleteScopeOfWork } from "./modals/DeleteScopeWork";
import { EditScopeWork } from "./modals/EditScopeWork";

const ProjectScopes = (props: ProjectScopesProps) => {
  const { onSuccess } = props;
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();
  const _project_id = router.query.project_id;
  const [selectedScope, setSelectedScope] = useState<any>([]);
  const [deleteScopeWork, setDeleteScopeWork] = useState(false);
  const [updateScopeWork, setUpdateScopeWork] = useState(false);

  const { data, isLoading, error, mutate } = useSWR(
    [
      _project_id ? `/api/projects/${_project_id}/scope/all` : null,
      access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  if (onSuccess) {
    mutate(data);
  }

  return (
    <div className="bg-white rounded-xl p-3 flex gap-2 w-1/2 flex-col">
      {deleteScopeWork && (
        <DeleteScopeOfWork
          open={deleteScopeWork}
          onOpenChange={(open: any) => setDeleteScopeWork(open)}
          scope={selectedScope}
          project={_project_id}
          onSuccess={(success: any) => (success ? mutate(data) : null)}
        />
      )}
      {updateScopeWork && (
        <EditScopeWork
          open={updateScopeWork}
          onOpenChange={(open: any) => setUpdateScopeWork(open)}
          scope={selectedScope}
          project={_project_id}
          onSuccess={(success: any) => (success ? mutate(data) : null)}
        />
      )}
      <ScrollArea
        className=""
        viewPortClassName="min-h-[400px] max-h-[50vh] rounded-app bg-white"
      >
        <p className="p-2 text-lg font-medium top-0 sticky z-10 inset-0 backdrop-blur-md">
          Project Scopes
        </p>
        <div className="flex flex-col gap-2">
          {!isLoading && data.length == 0 && (
            <div className="flex justify-center">
              <Image
                src="/images/No data-rafiki.svg"
                width={300}
                height={300}
                alt="No Data to Shown"
              />
            </div>
          )}

          {isLoading && <Loader2 className="animate-spin mx-auto m-5" />}
          {Array.isArray(data) &&
            data.map((item: any, key: number) => (
              <div
                className="border-b last:border-b-0 py-2 px-2 hover:bg-stone-100 rounded-app flex justify-between items-center gap-3"
                key={key}
              >
                <span
                  className="font-medium"
                  dangerouslySetInnerHTML={{
                    __html: item && item.project_scope_name,
                  }}
                ></span>
                <div className="flex self-start gap-1">
                  <Pencil
                    className="hover:cursor-pointer hover:rounded-full hover:bg-white h-[25px] w-[25px] px-1"
                    size={15}
                    color="orange"
                    onClick={() => {
                      setSelectedScope(item);
                      setUpdateScopeWork(true);
                    }}
                  />
                  <Trash
                    className="hover:cursor-pointer hover:rounded-full hover:bg-white h-[25px] w-[25px] px-1"
                    size={18}
                    color="red"
                    onClick={() => {
                      setSelectedScope(item);
                      setDeleteScopeWork(true);
                    }}
                  />
                </div>
              </div>
            ))}
        </div>
        {/* {pager && (
              <div className="mt-auto border-t border-t-stone-100 flex justify-end">
                <Pagination pager={pager} onPaginate={onPaginate} />
              </div>
            )} */}
      </ScrollArea>
    </div>
  );
};

export default memo(ProjectScopes);

type ProjectScopesProps = {
  onSuccess?: boolean;
};
