import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { fetchApi } from "@/utils/api.config";
import {
  ArrowRight,
  Eye,
  Flag,
  History,
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRouter as useRouterNav } from "next/navigation";
import { createContext, useRef, useState } from "react";
import useSWR from "swr";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import dynamic from "next/dynamic";
import useSize from "@/hooks/useSize";
import DesktopView from "./DesktopView";
import SearchInput from "@/components/app/search-input";

const ItemReportSheetModal = dynamic(
  () =>
    import("@/components/projects/shipping-list/modals/ItemReportSheetModal")
);
const ActivityLogSheetModal = dynamic(
  () =>
    import("@/components/projects/shipping-list/modals/ActivityLogSheetModal")
);
const DeleteDialog = dynamic(
  () =>
    import("@/components/projects/shipping-list/ShippingDetails/DeleteDialog")
);

export const ShippingListContainerSizeContext = createContext(null);

export default function ListView({
  access_token,
  _project_id,
  onProject,
}: {
  access_token: any;
  _project_id?: any;
  onProject?: boolean;
}) {
  const router = useRouter();
  const { push } = useRouterNav();
  const [search, setSearch] = useState(router.query.search || "");

  const payload: any = {
    page: router.query.page || 1,
  };

  if (router.query.search) payload["search"] = router.query.search;
  if (_project_id) payload["_project_id"] = _project_id;
  if (onProject) payload["search"] = search;

  const queryString = new URLSearchParams(payload).toString();
  const [shippingData, setShippingData] = useState<any>(null);
  const [openItemReport, setOpenItemReport] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<any>(false);
  const shippingListContainerRef = useRef<any>(null);
  const shippingListContainerSize: any = useSize(shippingListContainerRef);

  const { data, isLoading, error } = useSWR(
    [`/api/projects/shipping?${queryString}`, access_token],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const onClickAction = (key: number, row: any) => {
    switch (key) {
      case 0:
        push(`/projects/shipping-list/${row._shipping_id}`);
        break;
      case 1:
        push(`/projects/shipping-list/${row._shipping_id}/edit`);
        break;
      case 2:
        setShippingData(row);
        setOpenItemReport(true);
        break;
      case 3:
        window.open(
          "/projects/shipping-list/" + row._shipping_id + "/preview",
          "_blank",
          "noopener,noreferrer"
        );
        break;
      case 4:
        setShippingData(row);
        setActivityOpen(true);
        break;
      case 5:
        setShippingData(row);
        setOpenDeleteAlert(true);
        break;
    }
  };

  const onPaginate = (page: string) => {
    router.query.page = page;
    router.push(router);
  };

  const onSearch = (value: any) => {
    if (!onProject) {
      router.push({
        pathname: router.pathname,
        query: {
          search: value,
        },
      });
    }
    
    setSearch(value);
  };

  return (
    <>
      <ShippingDetailsContext.Provider value={shippingData}>
        <ItemReportSheetModal
          open={openItemReport}
          onOpenChange={(open: any) => setOpenItemReport(open)}
        />
        <ActivityLogSheetModal
          open={activityOpen}
          onOpenChange={(open: any) => setActivityOpen(open)}
        />

        <DeleteDialog
          open={openDeleteAlert}
          onOpenChange={(open) => setOpenDeleteAlert(open)}
          shipping_number={shippingData?.shipping_number}
          _shipping_id={shippingData?._shipping_id}
        />
      </ShippingDetailsContext.Provider>

      <ShippingListContainerSizeContext.Provider
        value={shippingListContainerSize}
      >
        <div
          className="w-full rounded-xl shadow "
          ref={shippingListContainerRef}
          style={{
            background:
              shippingListContainerSize?.width < 800 ? undefined : "#fff",
          }}
        >
          <div className="flex justify-between items-center py-2 px-3">
            <p className="text-lg flex font-medium">Shipping List</p>
            <div className="flex items-center gap-2">
              <Link href="/projects/shipping-list/create">
                <Button className="rounded-xl">New Shipping</Button>
              </Link>
              <SearchInput
                onChange={(e) => onSearch(e.target.value)}
                value={search}
                delay={1000}
              />
            </div>
          </div>

          <DesktopView
            isLoading={isLoading}
            data={data}
            onClickAction={onClickAction}
          />

          {data?.pager && (
            <div className="mt-auto border-t border-t-stone-100">
              <Pagination
                pager={data.pager}
                onPaginate={(page: any) => onPaginate(page)}
                currPage={payload["page"]}
              />
            </div>
          )}
        </div>
      </ShippingListContainerSizeContext.Provider>
    </>
  );
}

export const actionMenu = [
  {
    icon: <ArrowRight className="w-[18px] h-[18px] text-violet-500" />,
    name: "View",
  },
  {
    icon: <Pencil className="w-[18px] h-[18px] text-blue-500" />,
    name: "Update",
  },
  {
    icon: <Flag className="w-[18px] h-[18px] text-red-500" />,
    name: "Item Reports",
  },
  {
    icon: <Eye className="w-[18px] h-[18px] text-purple-500" />,
    name: "Preview",
  },
  {
    icon: <History className="w-[18px] h-[18px] text-blue-500" />,
    name: "History",
  },
  {
    icon: <Trash2 className="w-[18px] h-[18px] text-red-500" />,
    name: "Delete",
  },
];
