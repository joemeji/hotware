'use client';

import { BreakPointContext } from "@/context/layout-context";
import { cn } from "@/lib/utils";
import { Menu } from "lucide-react";
import Image from "next/image";
import React, { forwardRef, useContext } from "react";

type TopSidebarProp = {
  onToggleSidebar?: () => void,
  inHeader?: Boolean
}

const TopSidebar = forwardRef(({ inHeader = false, onToggleSidebar }: TopSidebarProp, ref: any) => {
  const bp = useContext(BreakPointContext);

  const logoPath = () => {
    const imgProps: any = {
      width: 120,
      height: 40,
      src: '/logos/main-logo.svg',
    };
    if (inHeader) {
      if (bp === 'sm' || bp === 'xs') {
        return {
          ...imgProps,
           src: '/logos/logo-icon.svg',
           width: 30,
        };
      }
      return {
        ...imgProps,
        src: '/logos/main-logo-black.svg',
      }
    }
    return {
      ...imgProps,
      src: '/logos/main-logo.svg'
    }
  };

  return (
    <div 
      className={cn(
        'h-[var(--header-height)] flex items-center ps-3',
        !inHeader && 'border-b border-b-stone-800'
      )}
      ref={ref}
    >
      <button 
        className={cn(
          'p-2 text-sidebarLink hover:bg-sidebarLinkHover',
          'focus:bg-sidebarLinkHover me-3 rounded-xl',
          inHeader && 'hover:bg-stone-200 focus:bg-stone-200'
        )}
        onClick={onToggleSidebar}
      >
        <Menu width={24} height={24} strokeWidth={2} />
      </button>
      <Image 
        alt="Hotwork"
        {...logoPath()}
      />
    </div>
  )
});

TopSidebar.displayName = 'TopSidebar';

export default TopSidebar;