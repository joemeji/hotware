import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import { Button, ButtonProps } from "@/components/ui/button";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { cn } from "@/lib/utils";
import { Eye, Flag, History, MoreHorizontal, Pencil, Plus } from "lucide-react";
import React, { memo, useContext, useState } from "react";
import dynamic from "next/dynamic";
import { ACTIVE, RETURNED } from "@/lib/shipping";
import DeleteDialog from "../DeleteDialog";
import { Separator } from "@/components/ui/separator";
import { Trash2 } from "lucide-react";

const ItemReportSheetModal = dynamic(
  () => import("../../modals/ItemReportSheetModal")
);
const ActivityLogSheetModal = dynamic(
  () => import("../../modals/ActivityLogSheetModal")
);

const ChangeStatusModal = dynamic(
  () => import("../../modals/ChangeStatusModal")
);

const AddFromSoldItemModal = dynamic(
  () => import("../../modals/AddFromSoldItemModal")
);

const AddLoadingListItemModal = dynamic(
  () => import("../../modals/AddLoadingListItemModal")
);

function DetailsActions() {
  const shippingData: any = useContext(ShippingDetailsContext);
  const _shipping_id = shippingData ? shippingData._shipping_id : null;
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const shipping_status = shippingData ? shippingData.shipping_status : null;
  const [activityOpen, setActivityOpen] = useState(false);
  const [openSoldItemModal, setOpenSoldItemModal] = useState(false);
  const [openLoadingModal, setOpenLoadingModal] = useState(false);
  const [openReportedItems, setOpenReportedItems] = useState(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<any>(false);

  return (
    <React.Fragment>
      <ChangeStatusModal
        onOpenChange={(open: any) => setStatusModalOpen(open)}
        open={statusModalOpen}
      />

      <ActivityLogSheetModal
        open={activityOpen}
        onOpenChange={(open: any) => setActivityOpen(open)}
      />

      <ItemReportSheetModal
        open={openReportedItems}
        onOpenChange={(open: any) => setOpenReportedItems(open)}
      />

      <AddFromSoldItemModal
        open={openSoldItemModal}
        onOpenChange={(open: any) => setOpenSoldItemModal(open)}
        shipping_id={_shipping_id}
      />

      <AddLoadingListItemModal
        open={openLoadingModal}
        onOpenChange={(open: any) => setOpenLoadingModal(open)}
      />

      <DeleteDialog
        open={openDeleteAlert}
        onOpenChange={(open) => setOpenDeleteAlert(open)}
        shipping_number={shippingData?.shipping_number}
        _shipping_id={shippingData?._shipping_id}
      />

      <div className="flex items-center gap-1">
        {shippingData?.shipping_status !== RETURNED && (
          <DetailAction onClick={() => setStatusModalOpen(true)}>
            <Pencil className="w-4 h-4 mr-2 text-blue-500" />
            Change Status
          </DetailAction>
        )}

        <DetailAction
          onClick={() => {
            window.open(
              "/projects/shipping-list/" + _shipping_id + "/preview",
              "_blank",
              "noopener,noreferrer"
            );
          }}
        >
          <Eye className="w-4 h-4 mr-2 text-purple-500" />
          Preview
        </DetailAction>
        <MoreOption
          menuTriggerChildren={
            <DetailAction>
              <MoreHorizontal className="w-5 h-5" />
            </DetailAction>
          }
        >
          {shipping_status === ACTIVE && (
            <>
              <DetailActionDropdownItem
                label="Add from Loading List"
                onClick={() => setOpenLoadingModal(true)}
                icon={<Plus className="w-[18px] h-[18px] text-violet-500" />}
              />
              <DetailActionDropdownItem
                label="Add from Sold Item"
                onClick={() => setOpenSoldItemModal(true)}
                icon={<Plus className="w-[18px] h-[18px] text-green-500" />}
              />

              <Separator className="my-2" />
            </>
          )}

          <DetailActionDropdownItem
            label="Item Reports"
            onClick={() => setOpenReportedItems(true)}
            icon={<Flag className="w-[18px] h-[18px] text-red-500" />}
          />

          <DetailActionDropdownItem
            label="History"
            onClick={() => setActivityOpen(true)}
            icon={<History className="w-[18px] h-[18px] text-blue-500" />}
          />

          <Separator className="my-2" />

          <DetailActionDropdownItem
            label="Delete"
            onClick={() => setOpenDeleteAlert(true)}
            icon={<Trash2 className="w-[18px] h-[18px] text-red-500" />}
          />
        </MoreOption>
      </div>
    </React.Fragment>
  );
}

export default memo(DetailsActions);

const DetailAction = React.forwardRef((props: ButtonProps, ref: any) => {
  const { className, children, ...rest } = props;
  return (
    <Button
      ref={ref}
      size={"sm"}
      variant="secondary"
      className={cn("py-1.5", className)}
      {...rest}
    >
      {children}
    </Button>
  );
});

DetailAction.displayName = "DetailAction";

function DetailActionDropdownItem({
  onClick,
  label,
  icon,
}: {
  onClick?: (e?: any) => void;
  label?: string;
  icon?: any;
}) {
  return (
    <ItemMenu className="px-3 py-2 flex gap-3" onClick={onClick}>
      {icon}
      <span className="font-medium">{label}</span>
    </ItemMenu>
  );
}
