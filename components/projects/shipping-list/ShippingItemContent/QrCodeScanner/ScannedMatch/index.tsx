import { Dialog, DialogContent } from "@/components/ui/dialog";
import React, { memo, useContext, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SerialNumberList } from "./SerialNumberList";
import ItemDetails from "./ItemDetails";
import InvalidQrCode from "./InvalidQrCode";
import { InvalidQrCodeContext, ShippingItemContext } from "..";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useSWRConfig } from "swr";
import { saveScannedItemApi } from "@/services/shipping/item";
import { deleteSerialNumberApi } from "@/services/shipping/serialNumber";

function ScannedMatch({
  open,
  onOpenChange,
  onScanAgain,
  onClickEdit,
}: ScannedMatch) {
  const [deniedPermission, setDeniedPermission] = useState(false);
  const shippingItem: any = useContext(ShippingItemContext);
  const invalid: any = useContext(InvalidQrCodeContext);
  const shippingDetails: any = useContext(ShippingDetailsContext);
  const _shipping_id = shippingDetails ? shippingDetails._shipping_id : null;
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [deletingSn, setDeletingSn] = useState(false);
  const [openAlertDialog, setOpenAlertDialog] = useState(false);
  const { mutate } = useSWRConfig();

  const saveScannedItem = async () => {
    const payload: any = {};

    if (shippingItem) payload._item_id = shippingItem._item_id;

    if (
      shippingItem &&
      Array.isArray(shippingItem.serial_numbers) &&
      shippingItem.serial_numbers[0]
    ) {
      const serial_number: any = shippingItem.serial_numbers[0];
      payload._serial_number_id = serial_number._serial_number_id;
    }

    setLoadingSubmit(true);

    try {
      const json = await saveScannedItemApi(_shipping_id, payload);

      if (json.exist === false) {
        mutate(`/api/shipping/${_shipping_id}/items`);
        setTimeout(() => {
          onOpenChange && onOpenChange(false);
          onScanAgain && onScanAgain(true);
        }, 400);
      }
    } finally {
      setLoadingSubmit(false);
    }
  };

  const onDeleteSerialNumber = async () => {
    try {
      setDeletingSn(true);
      const json = await deleteSerialNumberApi({
        shipping_item_details_id: shippingItem.shipping_item_details_id,
        shipping_item_id: shippingItem.shipping_item_id,
        _shipping_id,
      });

      if (json.success) {
        mutate(`/api/shipping/${_shipping_id}/items`);
        onScanAgain && onScanAgain(true);
        onOpenChange && onOpenChange(false);
      }
    } finally {
      setDeletingSn(false);
    }
  };

  useEffect(() => {
    (async () => {
      const permissionName = "camera" as PermissionName;
      const result = await navigator.permissions.query({
        name: permissionName,
      });
      if (result.state === "denied") {
        setDeniedPermission(false);
      }
      if (result.state === "prompt") {
        setDeniedPermission(false);
      }
    })();
  }, []);

  return (
    <>
      <AlertDialog
        open={openAlertDialog}
        onOpenChange={(open) => setOpenAlertDialog(open)}
      >
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Serial Number?</AlertDialogTitle>
            <AlertDialogDescription>
              <span>This action cannot be undone.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingSn}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deletingSn}
              onClick={onDeleteSerialNumber}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="overflow-auto gap-0 relative p-2"
          style={{ maxWidth: deniedPermission ? "400px" : undefined }}
        >
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200 absolute top-2 right-2">
            <X />
          </DialogPrimitive.Close>

          {!shippingItem ? (
            <InvalidQrCode
              onClickScanAgain={() => onScanAgain && onScanAgain(true)}
              message={
                invalid
                  ? "Invalid scanned QR Code"
                  : "Scanned QR Code alrealy exist."
              }
            />
          ) : (
            <React.Fragment>
              <ItemDetails />

              {shippingItem &&
                Array.isArray(shippingItem.serial_numbers) &&
                shippingItem.serial_numbers.map((serial: any, key: number) => (
                  <div className="px-4 mt-4" key={key}>
                    <SerialNumberList serial_number={serial.serial_number} />
                  </div>
                ))}

              <div className="px-4">
                {shippingItem &&
                  shippingItem.exist &&
                  shippingItem.serialized && (
                    <Error
                      message={
                        "Serial Code already exist on the shipping item."
                      }
                    />
                  )}

                {shippingItem &&
                  shippingItem.exist &&
                  !shippingItem.serialized && (
                    <Error message={"Equipment already exist on the list."} />
                  )}
              </div>

              <div className="px-4 pb-3 mt-6">
                {shippingItem && !shippingItem.exist && (
                  <Button
                    onClick={saveScannedItem}
                    className={cn("w-full", loadingSubmit && "loading")}
                  >
                    Add To Shipping
                  </Button>
                )}
                {shippingItem &&
                  shippingItem.exist &&
                  !shippingItem.serialized && (
                    <div className="flex gap-1">
                      <Button
                        variant={"secondary"}
                        className="w-full"
                        onClick={() => onOpenChange && onOpenChange(false)}
                      >
                        Close
                      </Button>
                      <Button
                        variant={"secondary"}
                        className="w-full"
                        onClick={() => onScanAgain && onScanAgain(true)}
                      >
                        Scan Again
                      </Button>
                      <Button
                        variant={"secondary"}
                        className="w-full"
                        onClick={() => {
                          onClickEdit &&
                            onClickEdit(
                              shippingItem && shippingItem.shipping_item_id
                            );
                          onOpenChange && onOpenChange(false);
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                {shippingItem &&
                  shippingItem.exist &&
                  shippingItem.serialized && (
                    <div className="flex gap-1">
                      <Button
                        variant={"secondary"}
                        className="w-full"
                        onClick={() => onOpenChange && onOpenChange(false)}
                      >
                        Close
                      </Button>
                      <Button
                        variant={"secondary"}
                        className="w-full"
                        onClick={() => onScanAgain && onScanAgain(true)}
                      >
                        Scan Again
                      </Button>
                      <Button
                        variant={"secondary"}
                        className="w-full"
                        onClick={() => setOpenAlertDialog(true)}
                      >
                        Remove SN
                      </Button>
                    </div>
                  )}
              </div>
            </React.Fragment>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function Error({ message }: { message?: any }) {
  return (
    <span className="mt-6 text-center text-red-500 font-medium  bg-red-50 py-2 flex items-center gap-2 px-3 rounded-sm border border-red-200">
      <AlertTriangle width={25} height={25} />
      {message}
    </span>
  );
}

type ScannedMatch = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  onScanAgain?: (scan?: boolean) => void;
  onClickEdit?: (item?: any) => void;
};

export default memo(ScannedMatch);
