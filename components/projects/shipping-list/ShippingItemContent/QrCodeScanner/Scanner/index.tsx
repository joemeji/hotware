import { Dialog, DialogContent } from "@/components/ui/dialog";
import { memo, useEffect, useState } from "react";
import Html5QrcodePlugin from "@/components/Html5QrcodePlugin";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

function Scanner({
  open,
  onOpenChange,
  onSuccessScan,
  onErrorScan,
  onClickUploadQrCode,
}: Scanner) {
  const [deniedPermission, setDeniedPermission] = useState(false);

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="p-0 overflow-auto gap-0 relative"
        style={{ maxWidth: deniedPermission ? "400px" : undefined }}
      >
        <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-primary/40 hover:bg-primary/30 text-white/40 absolute right-2 top-2 z-10">
          <X />
        </DialogPrimitive.Close>

        <p className="absolute top-3 bg-background/20 text-white left-1/2 -translate-x-1/2 py-1 px-2 rounded-sm z-10">
          Point your camera to scan a QR code
        </p>
        {(open || !deniedPermission) && (
          <Html5QrcodePlugin
            onSuccessScan={(decodedText, decodedResult) => {
              onSuccessScan && onSuccessScan(decodedResult);
            }}
            onErrorScan={onErrorScan}
          />
        )}
        <Button
          className="absolute bottom-3 left-1/2 -translate-x-1/2"
          onClick={onClickUploadQrCode}
        >
          Upload QR code
        </Button>
      </DialogContent>
    </Dialog>
  );
}

type Scanner = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  onSuccessScan?: (decodedResult?: any) => void;
  onErrorScan?: (errorMessage?: any) => void;
  onClickUploadQrCode?: () => void;
};

export default memo(Scanner);
