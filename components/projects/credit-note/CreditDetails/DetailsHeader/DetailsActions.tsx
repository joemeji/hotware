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
  CoinsIcon,
} from "lucide-react";
import React, { memo, useState } from "react";
import dynamic from "next/dynamic";
import { Separator } from "@/components/ui/separator";
import { useDelete } from "@/components/projects/credit-note/useDelete";
import { useChangeBookStatus } from "@/components/projects/credit-note/useChangeBookStatus";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import { previewPdf } from "@/services/projects/credit";
import { useSession } from "next-auth/react";
import { useSWRConfig } from "swr";
import Link from "next/link";

const ActivityLogSheetModal = dynamic(
  () => import("../../modals/ActivityLogSheetModal")
);

type DetailsActionsParams = {
  _credit_note_id: string | undefined;
  data: any;
};

function DetailsActions({ _credit_note_id, data }: DetailsActionsParams) {
  const { mutate } = useSWRConfig();
  const router = useRouter();
  const { data: session }: any = useSession();
  const [activityOpen, setActivityOpen] = useState(false);
  const { mutateDelete, Dialog: DeleteDialog } = useDelete({
    onDelete: () => {
      toast({
        title: "Credit note has been deleted successfully.",
        variant: "success",
        duration: 2000,
      });
      mutate(
        [`/api/projects/credits?`, session?.user?.access_token],
        undefined
      );
      setTimeout(() => {
        router.push("/projects/credit-note");
      }, 300);
    },
  });

  const { mutateBook, Dialog: BookDialog } = useChangeBookStatus({
    onBook: (item: string) => {
      mutate([`/api/projects/credits`, session?.user?.access_token], undefined);
    },
  });

  const onPreviewPdf = async (_credit_note_id: any) => {
    const res = await previewPdf(_credit_note_id, session?.user?.access_token);
    const blob = await res.blob();
    const objectURL = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = objectURL;
    a.target = "_blank";
    a.click();
  };

  const onDownloadPdf = async (_credit_note_id: any) => {
    const res = await previewPdf(_credit_note_id, session?.user?.access_token);
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
      <BookDialog />
      <ActivityLogSheetModal
        _credit_note_id={_credit_note_id}
        open={activityOpen}
        onOpenChange={(open: any) => setActivityOpen(open)}
      />

      <div className="flex items-center gap-1">
        <DetailAction onClick={() => onPreviewPdf(_credit_note_id)}>
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
            label="Delete"
            onClick={() => mutateDelete(_credit_note_id)}
            icon={<Trash2 className="w-[18px] h-[18px] text-red-500" />}
          />
          <Separator className="my-2" />
          <div
            onClick={() =>
              mutateBook(data?._credit_note_id, data?.credit_note_is_booked)
            }
            className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
          >
            <CoinsIcon
              className={`w-[18px] h-[18px] ${
                data?.credit_note_is_booked == 1
                  ? "text-red-500"
                  : "text-green-500"
              }`}
            />
            <span className="text-sm font-medium">
              {data?.credit_note_is_booked == 1 ? "Unbook" : "Book"}{" "}
              (Accounting)
            </span>
          </div>
          <Separator className="my-2" />
          <Link
            href={`/projects/invoices/${data?._invoice_id}`}
            className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
          >
            <FileText className="w-[18px] h-[18px] text-violet-500" />
            <span className="text-sm font-medium">Open Invoice</span>
          </Link>
          <Separator className="my-2" />
          <DetailActionDropdownItem
            onClick={() => setActivityOpen(true)}
            label="History"
            icon={<History className="w-[18px] h-[18px] text-blue-500" />}
          />
          <ItemMenu
            className="gap-3"
            onClick={() => onDownloadPdf(_credit_note_id)}
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
