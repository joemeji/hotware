import { memo, useContext, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import InputFile from "@/components/ui/input-file";
import Image from "next/image";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { cn } from "@/lib/utils";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { AccessTokenContext } from "@/context/access-token-context";
import { toast } from "@/components/ui/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type AddItemReportModal = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  data?: any;
};

const AddItemReportModal = ({
  open,
  onOpenChange,
  data,
}: AddItemReportModal) => {
  const [files, setFiles] = useState<any>(null);
  const [description, setDescription] = useState<any>(null);
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const access_token: any = useContext(AccessTokenContext);
  const [loading, setLoading] = useState(false);
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [error, setError] = useState<any>(null);

  const onSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("description_report", description);
      formData.append("report_attachment", files[0]);
      formData.append("serial_number_id", data?.serial_number_id || null);
      formData.append("shipping_item_id", data?.shipping_item_id);
      formData.append("item_id", data?.item_id);

      const res = await fetch(
        `${baseUrl}/api/projects/shipping/items/${shippingDetails?._shipping_id}/create_report`,
        {
          method: "POST",
          headers: authHeaders(access_token, true),
          body: formData,
        }
      );

      const json = await res.json();

      if (!json.success && json.error) {
        setError(json.error);
        setOpenAlertMessage(true);
      }

      if (json.success) {
        onOpenChange && onOpenChange(false);
        toast({
          title: "Report successfully added.",
          variant: "success",
          duration: 2000,
        });
      }
    } catch (err: any) {
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertDialog open={openAlertMessage} onOpenChange={setOpenAlertMessage}>
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{error && error.title}</AlertDialogTitle>
            <AlertDialogDescription>
              {error && (
                <span dangerouslySetInnerHTML={{ __html: error.description }} />
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={open}
        onOpenChange={(open: boolean) => onOpenChange && onOpenChange(open)}
      >
        <DialogContent className="max-w-[600px] p-0 overflow-auto gap-0">
          <DialogHeader className="py-1 px-3 flex justify-between flex-row items-center sticky top-0 bg-background z-10">
            <DialogTitle>Create Report</DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>

          {data && (
            <div className={cn("px-3 flex items-start gap-3 mt-3")}>
              <Image
                alt={data.shipping_item_name}
                width={200}
                height={200}
                className="w-[60px] h-[60px] object-cover rounded-sm"
                src={baseUrl + "/equipments/thumbnail/" + data.item_image}
                onError={(e: any) => {
                  e.target.srcset = `${baseUrl}/equipments/thumbnail/Coming_Soon.jpg`;
                }}
              />
              <div className="flex flex-col gap-1">
                <span className="font-medium text-base">
                  {data.shipping_item_name}
                </span>
                {data.serial_number && <span>{data.serial_number}</span>}
                {data.article_number && <span>{data.article_number}</span>}
              </div>
            </div>
          )}

          <form className="px-4 mt-3" onSubmit={onSubmit}>
            <div className="flex gap-3 flex-col">
              <div className="flex flex-col gap-1 w-full">
                <span>Description</span>
                <Textarea
                  className="bg-stone-100 border-0"
                  rows={5}
                  onChange={(e) => setDescription(e.target.value)}
                  value={description || ""}
                  required
                />
              </div>

              <div className="flex flex-col gap-1 w-full">
                <span>Upload File</span>
                <InputFile
                  accept="image/*"
                  onChange={(files) => setFiles(files)}
                  required={true}
                />
              </div>
            </div>
            <DialogFooter className="py-3">
              <Button type="button" variant={"ghost"} disabled={loading}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className={cn(loading && "loading")}
              >
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default memo(AddItemReportModal);
