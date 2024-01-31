import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { fetchApi } from "@/utils/api.config";
import { avatarFallback } from "@/utils/avatar";
import dayjs from "dayjs";
import { Check, X } from "lucide-react";
import { Pencil } from "lucide-react";
import { useRouter } from "next/router";
import React, { memo } from "react";
import useSWR from 'swr';

const _ShippingDetails = (props: ShippingDetails) => {
  const { children } = props;

  return (
    <div className="p-[20px] w-full max-w-[1600px] mx-auto">
      <div className="flex gap-5">
        {children}
      </div>
    </div>
  );
};

export const ShippingDetails = memo(_ShippingDetails);

type ShippingDetails = {
  children?: React.ReactNode
}

export const markIconProps = {
  width: 16,
  height: 16,
};

export const MarkWrapper = ({ className, children }: { className?: string, children: React.ReactNode }) => {
  return (
    <div className={cn("bg-green-700 p-[3px] w-fit rounded-full", className)}>
      {children}
    </div>
  );
};

export const CompleteIncompleteStatus = ({ completed = false }: { completed: boolean }) => {
  if (completed) {
    return (
      <MarkWrapper className="bg-green-700">
        <Check {...markIconProps} strokeWidth={4} className="text-white" />
      </MarkWrapper> 
    );
  }
  return (
    <MarkWrapper className="bg-red-700">
      <X {...markIconProps} strokeWidth={4} className="text-white" />
    </MarkWrapper>
  );
}