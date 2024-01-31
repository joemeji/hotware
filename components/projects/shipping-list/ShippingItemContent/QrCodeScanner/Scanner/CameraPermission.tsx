import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/utils/app";
import Image from "next/image";
import { memo } from "react";

function CameraPermission({ onClickAllow }: {onClickAllow?: () => void}) {
  return (
    <div className="flex flex-col items-center gap-6 p-4 mt-7">
      <Image src="/icons/icons8-camera-100.png" width={50} height={50} alt="Scanning Error" />
      <div className="flex flex-col gap-1 items-center">
        <p className="text-lg font-medium"><b>{APP_NAME}</b> Would Like to Access the Camera</p>
        <span className="text-center text-base">
          This lets you do things like take and share photos, record videos, and use other special features and effects.
        </span>
      </div>
      <Button className="w-full max-w-[99%]" onClick={onClickAllow}>Allow</Button>
    </div>
  );
}

export default memo(CameraPermission);