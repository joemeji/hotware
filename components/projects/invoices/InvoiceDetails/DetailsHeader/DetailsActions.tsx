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
} from "lucide-react";
import React, { memo, useState } from "react";
import { useSWRConfig } from "swr";
import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator";
import { useDelete } from "@/components/projects/invoices/useDelete";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import { previewPdf } from "@/services/projects/invoice";
import { useSession } from "next-auth/react";

const ChangeStatusModal = dynamic(
  () => import("../../modals/ChangeStatusModal")
);
const ActivityLogSheetModal = dynamic(
  () => import("../../modals/ActivityLogSheetModal")
);

type DetailsActionsParams = {
  _invoice_id: string | undefined;
};

function DetailsActions({ _invoice_id }: DetailsActionsParams) {
  const router = useRouter();
  const { data: session }: any = useSession();
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [activityOpen, setActivityOpen] = useState(false);
  const { mutateDelete, Dialog: DeleteDialog } = useDelete({
    onDelete: () => {
      toast({
        title: "Invoice has been deleted successfully.",
        variant: "success",
        duration: 2000,
      });
      setTimeout(() => {
        router.push("/projects/invoices");
      }, 300);
    },
  });

  const onPreviewPdf = async (_invoice_id: any) => {
    const res = await previewPdf(_invoice_id, session?.user?.access_token);
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectURL;
    a.target = "_blank";
    a.click();
  };

  const onDownloadPdf = async (_invoice_id: any) => {
    const res = await previewPdf(_invoice_id, session?.user?.access_token);
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

      <ChangeStatusModal
        onOpenChange={(open: any) => setStatusModalOpen(open)}
        open={statusModalOpen}
      />

      <ActivityLogSheetModal
        _invoice_id={_invoice_id}
        open={activityOpen}
        onOpenChange={(open: any) => setActivityOpen(open)}
      />

      <div className="flex items-center gap-1">
        <DetailAction onClick={() => onPreviewPdf(_invoice_id)}>
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
          <DetailActionDropdownItem
            onClick={() => setActivityOpen(true)}
            label="History"
            icon={<History className="w-[18px] h-[18px] text-blue-500" />}
          />
          <DetailActionDropdownItem
            label="Delete"
            onClick={() => mutateDelete(_invoice_id)}
            icon={<Trash2 className="w-[18px] h-[18px] text-purple-500" />}
          />
          <Separator className="my-2" />
          <ItemMenu
            className="gap-3"
            onClick={() => onDownloadPdf(_invoice_id)}
          >
            <FileText className="w-[18px] h-[18px] text-red-500" />
            <span className="font-medium">Save as Pdf</span>
          </ItemMenu>
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
