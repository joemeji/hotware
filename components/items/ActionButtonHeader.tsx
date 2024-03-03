import React, { memo } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const ActionButtonHeader = React.forwardRef(
  (
    {
      icon,
      name,
      onClick,
      loadingQrCodeButton,
      actionType,
      loadingTypeplateButton,
    }: {
      icon: any;
      name: any;
      onClick?: (e: any) => void;
      loadingQrCodeButton?: boolean;
      actionType?: string;
      loadingTypeplateButton?: boolean;
    },
    ref: any
  ) => {
    return (
      <Button
        className={cn(
          "rounded-xl py-1.5",
          actionType === "qr-code" && loadingQrCodeButton && "loading",
          actionType === "type-plate" && loadingTypeplateButton && "loading"
        )}
        variant={"secondary"}
        ref={ref}
        onClick={onClick}
        disabled={loadingQrCodeButton}
      >
        {icon}
        {name}
      </Button>
    );
  }
);
ActionButtonHeader.displayName = "ActionButtonHeader";

export default memo(ActionButtonHeader);
