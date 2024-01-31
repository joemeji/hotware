"use client"

import BottomMenu from "./bottom-menu";
import TopSidebar from "./top-sidebar";
import MainMenu from "./main-menu";
import { cn } from "@/lib/utils";
import { useContext, useRef } from "react";
import { SidebarContext } from "@/context/layout-context";

type SidebarProp = {
  onToggleSidebar?: () => void
}

export default function Sidebar({ onToggleSidebar }: SidebarProp) {
  const sidebarVisibility = useContext(SidebarContext);
  const topSidebarRef = useRef(null);

  return (
    <aside 
      className={cn(
        'fixed top-0 left-0 h-full w-[var(--sidebar-width)] z-30',
        'transition-transform duration-200 bg-sidebar',
        !sidebarVisibility && 'translate-x-[calc(0px-var(--sidebar-width))]',
      )}
    >
        <TopSidebar ref={topSidebarRef} onToggleSidebar={onToggleSidebar} />
        <NavigationMenuSidebar />
    </aside>
  );
}

const NavigationMenuSidebar = () => {
  return (
    <div className="flex flex-col h-[calc(100%-var(--header-height)-1px)]">
      <nav className={cn(
        'px-2 py-2 overflow-y-scroll relative',
        'max-h-[calc(100vh-(var(--header-height)+var(--sidebar-bottom-height)))] quickSearch-categories',
      )}>
        <MainMenu />
      </nav>
      <div className="mt-auto">
        <BottomMenu />
      </div>
    </div>
  );
}