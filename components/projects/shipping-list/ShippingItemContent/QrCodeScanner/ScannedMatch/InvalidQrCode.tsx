import QrCode from "@/components/icons/qr-code";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { memo } from "react";

function InvalidQrCode({
  onClickScanAgain,
  message,
}: {
  onClickScanAgain?: () => void;
  message?: any;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-6">
      <div className="relative w-fit bg-red-500 text-white">
        <X className="w-[80px] h-[80px]" />
      </div>
      <span className="font-medium text-base">{message}</span>

      <Button className="mt-4" onClick={onClickScanAgain}>
        Scan Again
      </Button>
    </div>
  );
}

export default memo(InvalidQrCode);
