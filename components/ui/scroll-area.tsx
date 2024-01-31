"use client";

import * as React from "react";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";

interface ScrollProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root> {
  onScrollViewport?: (e?: any) => void;
  onScrollEndViewPort?: (e?: any) => void;
  viewPortClassName?: string;
  viewPortStyle?: React.CSSProperties;
}

import { cn } from "@/lib/utils";
const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  ScrollProps
>(
  (
    {
      className,
      children,
      onScrollViewport,
      onScrollEndViewPort,
      viewPortClassName,
      viewPortStyle,
      ...props
    },
    ref
  ) => {
    const _onScrollViewPort = (e: any) => {
      onScrollViewport && onScrollViewport(e);
      if (
        e.target.scrollHeight - e.target.scrollTop - e.target.clientHeight <
        1
      ) {
        onScrollEndViewPort && onScrollEndViewPort(e);
      }
    };

    return (
      <ScrollAreaPrimitive.Root
        ref={ref}
        className={cn("relative overflow-hidden", className)}
        type="hover"
        {...props}
      >
        <ScrollAreaPrimitive.Viewport
          onScroll={_onScrollViewPort}
          className={cn("h-full w-full rounded-[inherit]", viewPortClassName)}
          style={viewPortStyle}
        >
          {children}
        </ScrollAreaPrimitive.Viewport>
        <ScrollBar />
        <ScrollAreaPrimitive.Corner />
      </ScrollAreaPrimitive.Root>
    );
  }
);
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <ScrollAreaPrimitive.ScrollAreaScrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors z-50",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 border-t border-t-transparent p-[1px]",
      className
    )}
    {...props}
  >
    <ScrollAreaPrimitive.ScrollAreaThumb className="relative flex-1 rounded-full bg-border" />
  </ScrollAreaPrimitive.ScrollAreaScrollbar>
));
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar };
