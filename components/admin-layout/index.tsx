'use client';

import { useEffect, useState } from 'react'
import Sidebar from './sidebar'
import Header from './header'
import { BreakPointContext, SidebarContext } from '@/context/layout-context'
import { cn } from '@/lib/utils';

type AdminType = {
  children: React.ReactNode,
  hasSidebar?: Boolean,
  hasHeader?: Boolean,
  onChangeSidebarOpen?: (open: boolean) => void,
}

export default function AdminLayout({ children, hasSidebar = true,  hasHeader = true, onChangeSidebarOpen }: AdminType) {
  const [sidebarVisibility, setSidebarVisibility] = useState(true);
  const [breakPointPrefix, setBreakPointPrefix] = useState('md');

  const mainResponsiveStyle = () => {
    if (breakPointPrefix === 'md' || breakPointPrefix === 'sm' || breakPointPrefix === 'xs') {
      const style =  {
        width: '100%',
        marginLeft: '0px',
      };
      return style;
    }
    return {};
  }

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 320 && window.innerWidth <= 480) {
        setBreakPointPrefix('xs');
        setSidebarVisibility(false);
      }
      if (window.innerWidth >= 481 && window.innerWidth <= 767) {
        setBreakPointPrefix('sm');
        setSidebarVisibility(false);
      }
      if (window.innerWidth >= 768 && window.innerWidth <= 991) {
        setBreakPointPrefix('md');
        setSidebarVisibility(false);
      }
      if (window.innerWidth >= 992 && window.innerWidth <= 1199) {
        setBreakPointPrefix('lg');
        setSidebarVisibility(true);
      }
      if (window.innerWidth >= 1200) {
        setBreakPointPrefix('xl');
        setSidebarVisibility(true);
      }
    }
    onResize();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    }
  }, []);

  useEffect(() => {
    if (breakPointPrefix === 'xs') {
      document.body.style.setProperty('--sidebar-width', '100%');
    } else {
      document.body.style.setProperty('--sidebar-width', '300px');
    }
  }, [breakPointPrefix]);

  useEffect(() => {
    onChangeSidebarOpen && onChangeSidebarOpen(sidebarVisibility);
  }, [sidebarVisibility, onChangeSidebarOpen]);

  return (
    <BreakPointContext.Provider value={breakPointPrefix}>
      <SidebarContext.Provider value={sidebarVisibility}>
        <>
          {hasSidebar && <Sidebar onToggleSidebar={() => setSidebarVisibility(!sidebarVisibility)} />}
          {hasHeader &&<Header onToggleSidebar={() => setSidebarVisibility(!sidebarVisibility)} />}
          <main 
            className={cn(
              'min-h-[calc(100vh-var(--header-height))]',
              'z-0 dark:text-zinc-300 w-[calc(100%-var(--sidebar-width))] ms-[var(--sidebar-width)]',
              // 'transition-all duration-200',
              'mt-[var(--header-height)]',
            )}
            style={{
              width: !sidebarVisibility ? '100%' : '',
              marginLeft: !sidebarVisibility ? '0px' : '',
              ...mainResponsiveStyle()
            }}
          >
            {children}
            {/* {children} {breakPointPrefix} */}
          </main>
        </>
        {sidebarVisibility && (breakPointPrefix === 'md' || breakPointPrefix === 'sm' || breakPointPrefix === 'xs') && (
          <div 
            className="fixed inset-0 bg-black/50 z-20" 
            tabIndex={0}
            onClick={() => setSidebarVisibility(false)}
          />
        )}
      </SidebarContext.Provider>
    </BreakPointContext.Provider>
  )
}