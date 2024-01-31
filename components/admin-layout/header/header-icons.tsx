import { BreakPointContext } from "@/context/layout-context";
import { cn } from "@/lib/utils";
import { Bell, Languages, ScanLine, Search } from "lucide-react";
import * as React from "react";

const linkProps = {
  strokeWidth: 1.5, 
  width: 22, 
  height: 22,
};

export default function HeaderIcons() {
  const bp = React.useContext(BreakPointContext);
  
  const links = [
    {
      name: 'Search',
      icon: <Search {...linkProps} />,
    },
    {
      name: 'Scan',
      icon: <ScanLine {...linkProps} />,
    },
    {
      name: 'English',
      icon: <Languages {...linkProps} />,
    },
    {
      name: 'Notifications',
      icon: <Bell {...linkProps} />,
    },
  ];

  return (
    <div 
      className={cn(
        'flex items-center gap-1',
      )}
    >
      {links.filter(item => {
        if (bp === 'sm' || bp === 'xs') return true;
        return item.name !== 'Search';
      }).map((item, key) => (
          <button key={key} 
            className={cn(
              'flex items-center justify-center rounded-full',
              ' dark:bg-zinc-700',
              'hover:bg-zinc-100 dark:hover:bg-zinc-800 dark:border-zinc-800',
              'h-[40px] w-[40px]'
            )}  
          >
          {item.icon}
        </button>
      ))}
    </div>
  );
}