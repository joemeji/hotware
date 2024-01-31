import AvatarProfile from "@/components/AvatarProfile";
import MoreOption from "@/components/MoreOption";
import AdminLayout from "@/components/admin-layout";
import { ItemMenu, TD, TH } from "@/components/items";
import Pagination from "@/components/pagination";
import StatusChip from "@/components/projects/shipping-list/StatusChip";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { addressFormat } from "@/lib/shipping";
import { cn } from "@/lib/utils";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { baseUrl, fetchApi } from "@/utils/api.config";
import { ArrowRight, Eye, Flag, History, Pencil, Trash2 } from "lucide-react";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRouter as useRouterNav } from "next/navigation";
import { createContext, useRef, useState } from "react";
import useSWR from "swr";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import dynamic from "next/dynamic";
import useSize from "@/hooks/useSize";
import ListView from "@/components/projects/shipping-list/__desktop/ListView";
import ListViewMobile from "@/components/projects/shipping-list/__mobile/ListView";

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

export default function ShippingList({ access_token }: any) {
  const router = useRouter();
  const { push } = useRouterNav();
  const [search, setSearch] = useState("");

  const payload: any = {};
  if (router.query.page) payload["page"] = router.query.page;
  if (router.query.search) payload["search"] = router.query.search;
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

  const onSearch = () => {
    if (!search) return;
    router.query.search = search;
    router.push(router);
  };

  return (
    <AdminLayout>
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
        <div className="p-[20px] w-full max-w-[1600px] mx-auto">
          <div
            className="w-full rounded-sm shadow-sm "
            ref={shippingListContainerRef}
            style={{
              background:
                shippingListContainerSize?.width < 800 ? undefined : "#fff",
            }}
          >
            <div className="flex justify-between p-4 items-center">
              <p className="text-xl flex font-medium">Shipping List</p>
              <form onSubmit={onSearch}>
                <Input
                  type="search"
                  placeholder="Search"
                  className="rounded-xl placeholder:text-stone-400 w-[400px]"
                  name="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </form>
              <Link href="/projects/shipping-list/create">
                <Button>New Shipping</Button>
              </Link>
            </div>

            {shippingListContainerSize?.width > 800 && (
              <ListView
                isLoading={isLoading}
                data={data}
                onClickAction={onClickAction}
              />
            )}

            {shippingListContainerSize?.width < 800 && (
              <ListViewMobile
                isLoading={isLoading}
                data={data}
                onClickAction={onClickAction}
              />
            )}

            {/* <ListViewMobile
              isLoading={isLoading}
              data={data}
              onClickAction={onClickAction}
            /> */}

            {data && data.pager && (
              <div className="mt-auto border-t border-t-stone-100">
                <Pagination
                  pager={data.pager}
                  onPaginate={(page: any) => onPaginate(page)}
                />
              </div>
            )}
          </div>
        </div>
      </ShippingListContainerSizeContext.Provider>
    </AdminLayout>
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

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  let token = null;

  if (session && session.user) {
    token = session.user.access_token;
  } else {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      access_token: token,
    },
  };
}
