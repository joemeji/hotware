import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AvatarProfile from "@/components/AvatarProfile";
import { signOut, useSession } from "next-auth/react";
import { baseUrl } from "@/utils/api.config";
import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import { LogOut } from "lucide-react";

export default function Avatar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  const user = useMemo<any>(() => {
    if (session?.user) {
      return session.user;
    }
    return null;
  }, [session]);

  return (
    <>
      {/* <DropdownMenu onOpenChange={setIsOpen} modal={false}> */}
      <MoreOption
        menuTriggerChildren={
          <button>
            <AvatarProfile
              firstname={user?.firstname || "N"}
              lastname={user?.lastname || "A"}
              photo={baseUrl + "/users/thumbnail/" + user?.photo}
              avatarColor={user?.avatar_color}
              avatarFallbackClassName="font-medium text-white"
            />
          </button>
        }
      >
        <ItemMenu className="flex gap-2" onClick={() => signOut()}>
          <LogOut className="w-[18px] h-[18px] text-red-600" />
          <span className="font-medium">Logout</span>
        </ItemMenu>
      </MoreOption>
      {/* <DropdownMenuTrigger asChild>
          <AvatarProfile
            firstname={user?.firstname || "N"}
            lastname={user?.lastname || "A"}
            photo={baseUrl + "/users/thumbnail/" + user?.photo}
            avatarColor={user?.avatar_color}
            avatarFallbackClassName="font-medium text-white"
          />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu> */}
    </>
  );
}
