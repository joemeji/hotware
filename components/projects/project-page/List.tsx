import MoreOption from "@/components/MoreOption";
import { UserAvatar } from "@/components/documents/employees/list";
import { ItemMenu, TD, TH } from "@/components/items";
import Pagination from "@/components/pagination";
import { AccessTokenContext } from "@/context/access-token-context";
import { status } from "@/lib/project";
import { cn } from "@/lib/utils";
import { fetchApi } from "@/utils/api.config";
import { Eye, FilePlus, Pencil, Settings2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { memo, useContext, useMemo, useState } from "react";
import useSWR from "swr";
import AddFromShipping from "./ProjectDetails/Equipments/AddFromShipping";
import ChangeStatus from "./ChangeStatus";
import { Skeleton } from "@/components/ui/skeleton";

const List = ({
  dashboardView,
  search,
}: {
  dashboardView?: boolean;
  search?: any;
}) => {
  const router = useRouter();
  const access_token = useContext(AccessTokenContext);
  const [alertFromShipping, setAlertFromShipping] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [openStatusAlert, setOpenStatusAlert] = useState(false);
  const [page, setPage] = useState(1);

  const payload = useMemo(() => {
    const _payload: any = {};

    _payload.page = router.query.page || 1;

    if (dashboardView) {
      _payload.page = page;
    }

    if (search) _payload.search = search;

    return _payload;
  }, [search, router, page, dashboardView]);

  let searchParams = new URLSearchParams(payload);
  const { data, isLoading, error, mutate } = useSWR(
    [`/api/projects?${searchParams.toString()}`, access_token],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const address = (row: any) => {
    let rows = [
      row.cms_address_building || null,
      row.cms_address_street || null,
      row.cms_address_city || null,
      row.cms_address_zip || null,
      row.country_cms_address_country || null,
    ];
    return rows.filter((loc: any) => loc !== null).join(", ");
  };

  const onPaginate = (_page: any) => {
    if (dashboardView) setPage(_page);
    else {
      router.query.page = _page;
      router.push(router);
    }
  };

  const onCreateShippingList = (project: any) => {
    setAlertFromShipping(true);
    setSelectedProject(project);
  };

  const onChangeStatus = (project: any) => {
    setSelectedProject(project);
    setOpenStatusAlert(true);
  };

  return (
    <>
      <AddFromShipping
        onSuccess={() => mutate(data)}
        _project_id={selectedProject?._project_id}
        open={alertFromShipping}
        onOpenChange={(open: any) => {
          setAlertFromShipping(open);
          if (!open) setSelectedProject(null);
        }}
      />

      <ChangeStatus
        project={selectedProject}
        onOpenChange={(open: any) => {
          setOpenStatusAlert(open);
          if (!open) setSelectedProject(null);
        }}
        open={openStatusAlert}
        onSuccess={() => mutate(data)}
      />

      <table className="w-full">
        <thead>
          {dashboardView ? (
            <tr>
              <TH className="ps-4 font-medium w-[70px]">Project</TH>
              <TH className="font-medium w-[200px]">Client</TH>
              <TH className="font-medium">Manpower</TH>
              <TH className="font-medium">Added By</TH>
              <TH className="font-medium"></TH>
              <TH className="text-right pe-4"></TH>
            </tr>
          ) : (
            <tr>
              <TH className="ps-4 font-medium w-[70px]">Project #</TH>
              <TH className="ps-4 font-medium w-[300px]">Client</TH>
              <TH className="font-medium w-[200px]">Project Name</TH>
              <TH className="font-medium">Manpower</TH>
              <TH className="font-medium">Date</TH>
              <TH className="font-medium">Start Date</TH>
              <TH className="font-medium">End Date</TH>
              <TH className="font-medium">Delivery Date</TH>
              <TH className="font-medium">Added By</TH>
              <TH className="font-medium">Status</TH>
              <TH className="text-right pe-4"></TH>
            </tr>
          )}
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td className="px-3 py-4" colSpan={dashboardView ? 6 : 11}>
                <div className="flex flex-col gap-3">
                  <Skeleton className="w-[350px] h-[15px]" />
                  <Skeleton className="w-[170px] h-[15px]" />
                </div>
              </td>
            </tr>
          )}

          {Array.isArray(data?.projects) && data.projects.length === 0 && (
            <tr>
              <td
                colSpan={dashboardView ? 6 : 11}
                className="py-3 text-center font-medium text-lg opacity-70"
              >
                No Records Found
              </td>
            </tr>
          )}
          {Array.isArray(data?.projects) &&
            data.projects.map((row: any, key: number) => {
              const actions = (
                <MoreOption>
                  <ItemMenu
                    className="gap-3"
                    onClick={() => {
                      router.push(`/projects/${row._project_id}`);
                    }}
                  >
                    <Eye className="w-[18px] h-[18px] text-blue-600" />
                    <span className="font-medium">View</span>
                  </ItemMenu>
                  <ItemMenu
                    className="gap-3"
                    onClick={() => {
                      router.push(`/projects/${row._project_id}/edit`);
                    }}
                  >
                    <Pencil className="w-[18px] h-[18px] text-orange-600" />
                    <span className="font-medium">Update</span>
                  </ItemMenu>
                  <ItemMenu
                    className="gap-3"
                    onClick={() => onCreateShippingList(row)}
                  >
                    <FilePlus className="w-[18px] h-[18px] text-purple-600" />
                    <span className="font-medium">Create Shipping List</span>
                  </ItemMenu>
                  <ItemMenu
                    className="gap-3"
                    onClick={() => onChangeStatus(row)}
                  >
                    <Settings2 className="w-[18px] h-[18px] text-green-600" />
                    <span className="font-medium">Change Status</span>
                  </ItemMenu>
                </MoreOption>
              );

              const projectName = (
                <div className="flex">
                  <span
                    title={row.project_name}
                    className="w-[250px] whitespace-nowrap overflow-hidden text-ellipsis font-medium"
                  >
                    {row.project_name}
                  </span>
                </div>
              );

              const projectNumber = (
                <Link
                  href={`/projects/${row._project_id}`}
                  title={row.project_number}
                >
                  <span className="font-medium text-blue-600">
                    {row.project_number}
                  </span>
                </Link>
              );

              const client = (
                <div className="flex flex-col">
                  <Link
                    href={`/address-manager/${row._cms_id}`}
                    className="font-medium hover:underline text-blue-700 w-[300px] whitespace-nowrap overflow-hidden text-ellipsis"
                    title={row.cms_name}
                  >
                    {row.cms_name}
                  </Link>
                  <span
                    title={address(row)}
                    className="w-[300px] whitespace-nowrap overflow-hidden text-ellipsis"
                  >
                    {address(row)}
                  </span>
                </div>
              );

              const po_number = row.project_po_number || "-";

              const manpower = row.project_man_power;
              const addedDate = row.added_date;
              const startDate = row.project_start_date
                ? row.project_start_date
                : "";
              const endDate = row.project_end_date ? row.project_end_date : "";
              const deliveryDate = row.project_delivery_date
                ? row.project_delivery_date
                : "";
              const status = <StatusChip status={row.project_status} />;

              const addedBy = (
                <UserAvatar
                  firstname={row.user_firstname}
                  lastname={row.user_lastname}
                  avatar_color={row.avatar_color}
                  photo={row.user_photo}
                />
              );

              if (dashboardView) {
                return (
                  <tr key={key} className="hover:bg-stone-50">
                    <TD className="align-top ps-4">
                      <div className="flex flex-col ga-1">
                        {projectName}
                        {projectNumber}
                      </div>
                    </TD>
                    <TD className="align-top">{client}</TD>
                    <TD className="align-top">{manpower}</TD>
                    <TD className="align-top">{addedBy}</TD>
                    <TD className="align-top">{status}</TD>
                    <TD className="align-top">{actions}</TD>
                  </tr>
                );
              }

              return (
                <tr key={key} className="hover:bg-stone-100">
                  <TD className="align-top ps-4">{projectNumber}</TD>
                  <TD className="align-top">{client}</TD>

                  <TD className="align-top">{projectName}</TD>
                  <TD className="align-top">{manpower}</TD>
                  <TD className="align-top">{addedDate}</TD>
                  <TD className="align-top">{startDate}</TD>
                  <TD className="align-top">{endDate}</TD>
                  <TD className="align-top">{deliveryDate}</TD>
                  <TD className="align-top">{addedBy}</TD>
                  <TD className="align-top">{status}</TD>
                  <TD className="align-top">{actions}</TD>
                </tr>
              );
            })}
        </tbody>
      </table>
      {data?.pager && (
        <div className="mt-auto border-t border-t-stone-100">
          <Pagination
            pager={data.pager}
            onPaginate={(page: any) => onPaginate(page)}
            currPage={payload["page"]}
          />
        </div>
      )}
    </>
  );
};

export default memo(List);

export const StatusChip = memo(({ status: statusName }: { status: any }) => {
  const _status = status[statusName];
  return (
    <div
      className={cn(
        "bg-[var(--bg-hover)] text-white w-fit px-3 py-[2px] rounded-full",
        "font-medium",
        "flex items-center"
      )}
      ref={(el) => {
        el?.style.setProperty("--bg-hover", `rgb(${_status?.color})`);
      }}
    >
      {_status?.name}
    </div>
  );
});

StatusChip.displayName = "StatusChip";
