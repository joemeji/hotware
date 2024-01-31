import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@radix-ui/react-tooltip"
import { Languages, Sun } from "lucide-react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import * as React from 'react';

const BottomMenu = () => {
  const bottomNav = React.useRef<any>(null);

  return (
    <TooltipProvider delayDuration={300}>
      <ul className="flex text-zinc-900 w-full justify-between py-2 px-5 border-t border-t-zinc-700" ref={bottomNav}>
        
      </ul>
    </TooltipProvider>
  )
}

export default BottomMenu