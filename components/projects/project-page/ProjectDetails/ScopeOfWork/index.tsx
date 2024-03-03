import { ScrollArea } from "@/components/ui/scroll-area";
import { AccessTokenContext } from "@/context/access-token-context";
import React, {
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import HeaderButtons from "./HeaderButtons";
import ProjectWorkDates from "./ProjectWorkDates";
import ProjectScopes from "./ProjectScopes";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { AddNewScopeWork } from "./modals/AddScopeWork";
import { ProjectCostCalculation } from "./modals/ProjectCostCalculation";

const ScopeOfWork = (props: ScopeOfWorkProps) => {
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();
  const _project_id = router.query.project_id;

  const [addNewScope, setAddNewScope] = useState(false);
  const [openCostCalculation, setOpenCostCalculation] = useState(false);
  const [onSuccess, setOnSuccess] = useState(false);

  const { data, isLoading, error, mutate } = useSWR(
    [_project_id ? `/api/projects/${_project_id}/client` : null, access_token],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  function headerEvents(evt: any) {
    if (evt == "add") {
      setAddNewScope(true);
    } else if (evt == "cost-calculation") {
      setOpenCostCalculation(true);
    }
  }

  return (
    <div className="flex flex-col gap-2 mt-2">
      {addNewScope && (
        <AddNewScopeWork
          open={addNewScope}
          onOpenChange={(open: any) => setAddNewScope(open)}
          project={data && data.project}
          onSuccess={(success: any) => setOnSuccess(success)}
        />
      )}
      {openCostCalculation && (
        <ProjectCostCalculation
          open={openCostCalculation}
          onOpenChange={(open: any) => setOpenCostCalculation(open)}
          project={data && data.project}
          onSuccess={(success: any) => setOnSuccess(success)}
        />
      )}
      <div className="bg-stone-100 flex gap-2">
        <div className="bg-white rounded-xl p-3 flex gap-2 w-1/2">
          <div className="flex flex-col py-1 gap-4">
            <HeaderButtons onClickItem={(evt: any) => headerEvents(evt)} />
            <ProjectWorkDates project={data && data.project} />
          </div>
        </div>
        <ProjectScopes onSuccess={onSuccess} />
      </div>
    </div>
  );
};

export default memo(ScopeOfWork);

type ScopeOfWorkProps = {
  headerSize?: any;
};
