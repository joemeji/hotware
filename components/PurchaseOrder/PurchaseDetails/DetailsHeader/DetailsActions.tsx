import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  FileSearch,
  MoreHorizontal,
  History,
  Trash2,
  FileText,
  Copy,
  FileOutput,
} from "lucide-react";
import React, { memo, useState } from "react";
import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import { previewPdf } from "@/services/projects/purchases";
import { useSession } from "next-auth/react";
import { useSWRConfig } from "swr";
import { isOpen } from "@/lib/purchase";
import { useDelete } from "@/components/PurchaseOrder/useDelete";
import { useCopy } from "@/components/PurchaseOrder/useCopy";
import { useRevision } from "@/components/PurchaseOrder/useRevision";
import { useChangeStatus } from "@/components/PurchaseOrder/useChangeStatus";

const ChangeStatusModal = dynamic(
  () => import("../../modals/ChangeStatusModal")
);
const ActivityLogSheetModal = dynamic(
  () => import("../../modals/ActivityLogSheetModal")
);

type DetailsActionsParams = {
  _po_id: string | undefined;
  data: any;
};

function DetailsActions({ _po_id, data }: DetailsActionsParams) {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { data: session }: any = useSession();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const { mutateDelete, Dialog: DeleteDialog } = useDelete({
    onDelete: () => {
      toast({
        title: "Purchase order has been deleted successfully.",
        variant: "success",
        duration: 2000,
      });
      mutate([`/api/purchases?`, session?.user?.access_token], undefined);
      setTimeout(() => {
        router.push("/purchase-order");
      }, 300);
    },
  });
  const { mutateCopy, Dialog: CopyDialog } = useCopy({
    onCopy: (item: string) => {
      router.push(`/purchase-order/${item}`);
    },
  });
  const { mutateRevision, Dialog: RevisionDialog } = useRevision({
    onRevision: (item: string) => {
      router.push(`/purchase-order/${item}`);
    },
  });
  const { mutateChange, Dialog: ChangeStatusDialog } = useChangeStatus({
    onChange: (item: string) => {
      mutate(
        [`/api/purchases/details/${_po_id}`, session?.user?.access_token],
        undefined
      );
    },
  });

  const onPreviewPdf = async (_po_id: any) => {
    const res = await previewPdf(_po_id, session?.user?.access_token);
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectURL;
    a.target = "_blank";
    a.click();
  };

  const onDownloadPdf = async (_po_id: any) => {
    const res = await previewPdf(_po_id, session?.user?.access_token);
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);
    let filename = res.headers.get("Title");
    const a = document.createElement("a");
    a.href = objectURL;
    a.download = (filename as string) + ".pdf";
    a.click();
  };

  return (
    <React.Fragment>
      <DeleteDialog />
      <CopyDialog />
      <RevisionDialog />
      <ChangeStatusDialog />

      <ChangeStatusModal
        onOpenChange={(open: any) => setStatusModalOpen(open)}
        open={statusModalOpen}
      />

      <ActivityLogSheetModal
        _po_id={_po_id}
        open={activityOpen}
        onOpenChange={(open: any) => setActivityOpen(open)}
      />

      <div className="flex items-center gap-1">
        <DetailAction onClick={() => onPreviewPdf(_po_id)}>
          <FileSearch className="w-4 h-4 mr-2" strokeWidth={1} />
          Preview
        </DetailAction>
        <MoreOption
          menuTriggerChildren={
            <DetailAction>
              <MoreHorizontal className="w-5 h-5" strokeWidth={1} />
            </DetailAction>
          }
        >
          {data && isOpen(data) ? (
            <>
              <div
                onClick={() => mutateRevision(_po_id)}
                className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
              >
                <FileOutput className="w-[18px] h-[18px] text-cyan-500" />
                <span className="text-sm font-medium">Revision</span>
              </div>
              <div
                onClick={() => mutateChange(_po_id)}
                className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
              >
                <FileOutput className="w-[18px] h-[18px] text-rose-500" />
                <span className="text-sm font-medium">Change Status</span>
              </div>
              <DetailActionDropdownItem
                label="Delete"
                onClick={() => mutateDelete(_po_id)}
                icon={<Trash2 className="w-[18px] h-[18px] text-purple-500" />}
              />
            </>
          ) : null}
          <div
            onClick={() => mutateCopy(_po_id)}
            className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
          >
            <Copy className="w-[18px] h-[18px] text-teal-500" />
            <span className="text-sm font-medium">Copy</span>
          </div>
          <Separator className="my-2" />
          <ItemMenu className="gap-3" onClick={() => onDownloadPdf(_po_id)}>
            <FileText className="w-[18px] h-[18px] text-red-500" />
            <span className="font-medium">Save as Pdf</span>
          </ItemMenu>
          <DetailActionDropdownItem
            onClick={() => setActivityOpen(true)}
            label="History"
            icon={<History className="w-[18px] h-[18px] text-blue-500" />}
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
