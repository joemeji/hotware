import AvatarProfile from "@/components/AvatarProfile";
import LoadingMore from "@/components/LoadingMore";
import { beginScrollDataPagerForInfiniteswr } from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AccessTokenContext } from "@/context/access-token-context";
import { ProjectDetailsContext } from "@/pages/projects/[project_id]";
import { baseUrl, fetchApi } from "@/utils/api.config";
import dayjs from "dayjs";
import Link from "next/link";
import { useContext } from "react";
import useSWRInfinite from "swr/infinite";

const PurchaseOrder = ({ headerSize }: { headerSize?: any }) => {
  const project: any = useContext(ProjectDetailsContext);
  const access_token = useContext(AccessTokenContext);

  const { data, isLoading, error, size, setSize, isValidating } =
    useSWRInfinite((index) => {
      let paramsObj: any = {};
      paramsObj["page"] = index + 1;
      let searchParams = new URLSearchParams(paramsObj);
      return [
        project?.data &&
          `/api/projects/${
            project.data?._project_id
          }/purchase_order?${searchParams.toString()}`,
        access_token,
      ];
    }, fetchApi);

  const _data: any = data ? [].concat(...data) : [];
  const isLoadingMore =
    isLoading || (size > 0 && data && typeof data[size - 1] === "undefined");

  const onscrollend = () => {
    const currentPage = beginScrollDataPagerForInfiniteswr(_data, size);
    if (currentPage) {
      setSize(currentPage);
    }
  };

  return (
    <ScrollArea
      className="bg-background w-1/2 rounded-xl"
      viewPortStyle={{
        height: `calc(100vh - (var(--header-height) + ${
          headerSize?.height + 40
        }px))`,
      }}
      onScrollEndViewPort={onscrollend}
    >
      <div className="p-3 sticky top-0 z-10 backdrop-blur-sm">
        <p className="font-medium text-lg">Purchase Orders</p>
      </div>

      <div className="gap-3 p-5 pb-0 pt-1 columns-2">
        {Array.isArray(_data) &&
          _data.map((data: any) => {
            return (
              Array.isArray(data.list) &&
              data.list.map((item: any, key: number) => (
                <PurchaseOrderCard
                  key={key}
                  firstname={item.user_firstname}
                  lastname={item.user_lastname}
                  user_photo={item.user_photo}
                  avatar_color={item.avatar_color}
                  po_date={item.po_date}
                  _po_id={item._po_id}
                />
              ))
            );
          })}
      </div>

      {(project.isLoading || isLoadingMore) && (
        <div className="pb-3">
          <LoadingMore />
        </div>
      )}
    </ScrollArea>
  );
};

export default PurchaseOrder;

const PurchaseOrderCard = ({
  firstname,
  lastname,
  user_photo,
  po_date,
  avatar_color,
  _po_id,
}: {
  firstname?: any;
  lastname?: any;
  user_photo?: any;
  po_date?: any;
  avatar_color?: any;
  _po_id?: any;
}) => {
  const project: any = useContext(ProjectDetailsContext);

  return (
    <div className="grid grid-rows-[1fr_auto] break-inside-avoid mb-3">
      <div className="hover:bg-stone-50 border p-3 rounded-xl flex flex-col gap-1">
        <div className="flex justify-between">
          <p className="font-bold text-base">{project?.data?.project_number}</p>
          <Link href={`/purchase-order/${_po_id}`} target="_blank">
            <Button variant={"secondary"} className="py-1">
              View
            </Button>
          </Link>
        </div>

        <p className="text-stone-700 text-sm">
          {dayjs(po_date).format("MMM DD, YYYY")}
        </p>

        {(firstname || lastname) && (
          <div className="flex gap-1 items-center">
            <AvatarProfile
              firstname={firstname}
              lastname={lastname}
              photo={baseUrl + "/users/thumbnail/" + user_photo}
              avatarFallbackClassName="font-medium text-white"
              avatarColor={avatar_color}
            />
            <p className="font-medium">
              {firstname} {lastname}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
