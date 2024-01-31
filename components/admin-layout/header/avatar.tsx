import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Avatar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <DropdownMenu onOpenChange={setIsOpen} modal={false}>
        <DropdownMenuTrigger asChild>
          <div tabIndex={0}
            className={cn(
              'flex items-center gap-1 cursor-pointer rounded-app',
              isOpen && 'bg-zinc-100 dark:bg-zinc-800'
            )}
          >
            <div 
              className={cn(
                'bg-violet-500 text-white rounded-[50%] flex items-center justify-center text-xl h-[40px] w-[40px]',
              )}
            > J </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}