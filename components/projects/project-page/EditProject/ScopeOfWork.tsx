import ErrorFormMessage from "@/components/app/error-form-message";
import { TD, TH } from "@/components/items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { AccessTokenContext } from "@/context/access-token-context";
import { fetchApi } from "@/utils/api.config";
import uniqid from "@/utils/text";
import dayjs from "dayjs";
import { Trash } from "lucide-react";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import useSWR from "swr";

type ScopeOfWork = {
  project_travelling_date?: any;
  project_travelling_days?: any;
  project_installation_date?: any;
  project_installation_days?: any;
  project_working_days?: any;
  project_start_date?: any;
  project_end_date?: any;
  project_dismantling_date?: any;
  project_dismantling_days?: any;
  project_travelling_back_date?: any;
  project_travelling_back_days?: any;
  errors?: any;
  scopes?: any;
  onAddedScopes?: (scope: any) => void;
  setValue?: any;
  data?: any;
};

const ScopeOfWork = ({
  project_travelling_date,
  project_travelling_days,
  project_installation_date,
  project_installation_days,
  project_working_days,
  project_start_date,
  project_end_date,
  project_dismantling_date,
  project_dismantling_days,
  project_travelling_back_date,
  project_travelling_back_days,
  errors,
  onAddedScopes,
  setValue,
  data,
}: ScopeOfWork) => {
  const [_scopes, set_scopes] = useState<any>([]);
  const [scopeName, setScopeName] = useState("");
  const router = useRouter();
  const access_token = useContext(AccessTokenContext);

  const [travellingGoing, setTravellingGoing] = useState<{
    days: any;
    date: any;
  }>({
    date: "",
    days: 0,
  });

  const [installation, setInstallation] = useState<{ days: any; date: any }>({
    date: "",
    days: 0,
  });

  const [dismantling, setDismantling] = useState<{ days: any; date: any }>({
    date: "",
    days: 0,
  });

  const [travellingBack, setTravellingBack] = useState<{
    days: any;
    date: any;
  }>({
    date: "",
    days: 0,
  });

  const [workingProject, setWorkingProject] = useState<{
    days: any;
    startDate: any;
    endDate: any;
  }>({
    days: 0,
    startDate: dayjs().format("YYYY-MM-DD"),
    endDate: "",
  });

  const onChangeDays = (
    e: any,
    type: "travellingGoing" | "installation" | "dismantling" | "travellingBack"
  ) => {
    if (type === "travellingGoing")
      setTravellingGoing({ ...travellingGoing, days: e.target.value });
    if (type === "installation")
      setInstallation({ ...installation, days: e.target.value });
    if (type === "dismantling")
      setDismantling({ ...dismantling, days: e.target.value });
    if (type === "travellingBack")
      setTravellingBack({ ...travellingBack, days: e.target.value });

    calcDates(type, e);
  };

  const onChangeWorkingDate = (
    e: any,
    type: "startDate" | "endDate" | "days"
  ) => {
    setWorkingProject({ ...workingProject, [type]: e.target.value });
    calcDates(type, e);
  };

  const onAddScope = () => {
    set_scopes((_scopes: any) => {
      return [
        ..._scopes,
        {
          scope_work: scopeName,
          uuid: uniqid(),
        },
      ];
    });
    setScopeName("");
  };

  const calcDates = (type: any, e: any) => {
    const updateItems: any = {
      travellingGoing: { ...travellingGoing },
      installation: { ...installation },
      dismantling: { ...dismantling },
      travellingBack: { ...travellingBack },
    };

    const _workingProject: any = { ...workingProject };

    if (type === "startDate" || type === "endDate" || type === "days") {
      _workingProject[type] = e.target.value;
    } else {
      updateItems[type] = {
        ...updateItems[type],
        [e.target.type === "date" ? "date" : "days"]: e.target.value,
      };
    }

    const installationDate = dayjs(_workingProject.startDate || new Date())
      .add(-Math.abs(updateItems.installation.days), "day")
      .format("YYYY-MM-DD");

    const tavellingGoingDate = dayjs(installationDate)
      .add(-Math.abs(updateItems.travellingGoing.days), "day")
      .format("YYYY-MM-DD");

    const endDate = dayjs(_workingProject.startDate || new Date())
      .add((_workingProject.days || 0) - 1, "day")
      .format("YYYY-MM-DD");

    const dismantlingDate = dayjs(endDate || new Date())
      .add(1, "day")
      .format("YYYY-MM-DD");

    const travellingBackDate = dayjs(dismantlingDate)
      .add(updateItems.dismantling.days, "day")
      .format("YYYY-MM-DD");

    setValue && setValue("project_installation_date", installationDate);
    setValue && setValue("project_dismantling_date", dismantlingDate);
    setValue && setValue("project_travelling_back_date", travellingBackDate);
    setValue && setValue("project_end_date", endDate);
    setValue && setValue("project_travelling_date", tavellingGoingDate);

    setTravellingGoing((travellingGoing: any) => {
      return {
        ...travellingGoing,
        date: tavellingGoingDate,
      };
    });

    setInstallation((installation: any) => {
      return {
        ...installation,
        date: installationDate,
      };
    });

    setWorkingProject((workingProject: any) => {
      return {
        ...workingProject,
        endDate,
      };
    });

    setDismantling((dismantling: any) => {
      return {
        ...dismantling,
        date: dismantlingDate,
      };
    });

    setTravellingBack((travellingBack: any) => {
      return {
        ...travellingBack,
        date: travellingBackDate,
      };
    });
  };

  const onRemoveScope = (uuid: any) => {
    if (Array.isArray(_scopes)) {
      const __scopes = [..._scopes];
      const scopeIndex = __scopes.findIndex(
        (scope: any) => scope.uuid === uuid
      );
      __scopes.splice(scopeIndex, 1);
      set_scopes(__scopes);
    }
  };

  const filterScopes = () => {
    if (Array.isArray(_scopes)) {
      const __scopes: any = [];

      _scopes.forEach((scope: any) => {
        if (!scope.removed) {
          __scopes.push(scope);
        }
      });
      return __scopes;
    }
    return [];
  };

  const { data: scopeData, isLoading } = useSWR(
    [`/api/projects/${router.query.project_id}/scope/all`, access_token],
    fetchApi
  );

  useEffect(() => {
    if (Array.isArray(scopeData)) {
      const _scopeData = [...scopeData].map((item: any) => ({
        scope_work: item.project_scope_name,
        project_scope_id: item.project_scope_id,
        project_id: item.project_id,
        uuid: uniqid(),
      }));
      set_scopes(_scopeData);
    }
  }, [scopeData]);

  useEffect(() => {
    if (data) {
      setTravellingGoing({
        days: data.project_travelling_days,
        date: data.project_travelling_date,
      });
      setInstallation({
        days: data.project_installation_days,
        date: data.project_installation_date,
      });
      setDismantling({
        days: data.project_dismantling_days,
        date: data.project_dismantling_date,
      });
      setTravellingBack({
        days: data.project_travelling_back_days,
        date: data.project_travelling_back_date,
      });
      setWorkingProject({
        days: data.project_working_days,
        startDate: data.project_start_date,
        endDate: data.project_end_date,
      });
    }
  }, [data]);

  useEffect(() => {
    onAddedScopes && onAddedScopes(_scopes);
  }, [onAddedScopes, _scopes]);

  return (
    <div className="bg-background p-6 rounded-app shadow-sm w-1/2">
      <div className="flex flex-col">
        <p className="font-medium text-base">Scope of Work</p>
        <p className="">Add scope of work</p>

        <div className="flex gap-3 mt-4 flex-wrap">
          <div className="flex gap-3 w-full">
            <GroupForm
              label="Travelling (Going)"
              date={project_travelling_date}
              days={project_travelling_days}
              errors={errors}
              style={{ width: "50%" }}
              // onChangeDate={(e) => onChangeDate(e, "travellingGoing")}
              onChangeDays={(e) => onChangeDays(e, "travellingGoing")}
              dateValue={travellingGoing.date}
              daysValue={travellingGoing.days}
            />

            <GroupForm
              label="Installation"
              date={project_installation_date}
              days={project_installation_days}
              errors={errors}
              style={{ width: "50%" }}
              // onChangeDate={(e) => onChangeDate(e, "installation")}
              onChangeDays={(e) => onChangeDays(e, "installation")}
              dateValue={installation.date}
              daysValue={installation.days}
            />
          </div>

          <div className="flex gap-3 w-full">
            <div className="p-3 border rounded-xl w-1/2">
              <p className="font-medium text-base">Working (On Project)</p>
              <Separator className="my-3" />
              <div className="flex flex-col gap-2">
                <div className="flex flex-col gap-1 w-full">
                  <label className="font-medium">Days</label>
                  <Input
                    type="number"
                    className="bg-stone-100 border-0"
                    placeholder="Days"
                    {...project_working_days}
                    error={errors && errors.project_working_days ? true : false}
                    onChange={(e) => {
                      project_working_days?.onChange(e);
                      onChangeWorkingDate(e, "days");
                    }}
                    value={workingProject.days}
                  />
                  {errors.project_working_days && (
                    <ErrorFormMessage
                      message={errors.project_working_days?.message}
                    />
                  )}
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label className="font-medium">Start Date</label>
                  <Input
                    type="date"
                    className="bg-stone-100 border-0"
                    {...project_start_date}
                    error={errors && errors.project_start_date ? true : false}
                    onChange={(e) => {
                      project_start_date?.onChange(e);
                      onChangeWorkingDate(e, "startDate");
                    }}
                    value={workingProject.startDate || ""}
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
                  <label className="font-medium">End Date</label>
                  <Input
                    type="date"
                    className="bg-stone-100 border-0"
                    {...project_end_date}
                    error={errors && errors.project_end_date ? true : false}
                    onChange={(e) => {
                      project_end_date?.onChange(e);
                      onChangeWorkingDate(e, "endDate");
                    }}
                    value={workingProject.endDate || ""}
                    readOnly
                  />
                </div>
              </div>
            </div>

            <div className="flex w-1/2 flex-col gap-3">
              <GroupForm
                label="Dismantling"
                date={project_dismantling_date}
                days={project_dismantling_days}
                errors={errors}
                style={{ width: "100%" }}
                // onChangeDate={(e) => onChangeDate(e, "dismantling")}
                onChangeDays={(e) => onChangeDays(e, "dismantling")}
                dateValue={dismantling.date}
                daysValue={dismantling.days}
              />
              <GroupForm
                label="Travel (Back)"
                date={project_travelling_back_date}
                days={project_travelling_back_days}
                errors={errors}
                style={{ width: "100%" }}
                // onChangeDate={(e) => onChangeDate(e, "travellingBack")}
                onChangeDays={(e) => onChangeDays(e, "travellingBack")}
                dateValue={travellingBack.date}
                daysValue={travellingBack.days}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1 w-full mt-3">
        <label className="font-medium">Scope of Work</label>
        <div className="flex items-center gap-3">
          <Input
            placeholder="Enter Scope of Work"
            className="w-[calc(100%-110px)] bg-stone-100 border-0"
            onChange={(e) => setScopeName(e.target.value)}
            value={scopeName}
          />
          <Button
            className="w-[110px]"
            type="button"
            disabled={!scopeName}
            onClick={onAddScope}
          >
            Add Scope
          </Button>
        </div>
      </div>

      {filterScopes().length > 0 && (
        <div className="border rounded-xl overflow-hidden mt-3">
          <table className="w-full">
            <thead>
              <tr>
                <TH className="font-medium">Scope of Work</TH>
                <TH></TH>
              </tr>
            </thead>
            <tbody>
              {filterScopes().map((scope: any, key: number) => (
                <tr key={key}>
                  <TD className="font-medium">{scope.scope_work}</TD>
                  <TD className="text-right">
                    <Button
                      variant={"secondary"}
                      className="p-1 px-2"
                      title="Delete"
                      type="button"
                      onClick={() => onRemoveScope(scope.uuid)}
                    >
                      <Trash className="w-[18px] text-red-600" />
                    </Button>
                  </TD>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ScopeOfWork;

const GroupForm = ({
  date,
  days,
  errors,
  label,
  style,
  onChangeDays,
  onChangeDate,
  daysValue,
  dateValue,
}: {
  date?: any;
  days?: any;
  errors?: any;
  label?: any;
  style?: any;
  onChangeDays?: (e?: any) => void;
  onChangeDate?: (e?: any) => void;
  daysValue?: any;
  dateValue?: any;
}) => {
  return (
    <div className="p-3 border rounded-xl" style={style}>
      <p className="font-medium text-base">{label}</p>
      <Separator className="my-3" />
      <div className="flex gap-3">
        <div className="flex flex-col gap-1 w-full">
          <label className="font-medium">Date</label>
          <Input
            type="date"
            className="bg-stone-100 border-0"
            {...date}
            onChange={(e) => {
              date?.onChange(e);
              onChangeDate && onChangeDate(e);
            }}
            error={errors && errors[date.name] ? true : false}
            value={dateValue}
            readOnly
          />
        </div>
        <div className="flex flex-col gap-1 w-[150px]">
          <label className="font-medium">Days</label>
          <Input
            type="number"
            className="bg-stone-100 border-0"
            placeholder="Days"
            {...days}
            onChange={(e) => {
              days?.onChange(e);
              onChangeDays && onChangeDays(e);
            }}
            error={errors && errors[days.name] ? true : false}
            value={daysValue}
          />
        </div>
      </div>
    </div>
  );
};
