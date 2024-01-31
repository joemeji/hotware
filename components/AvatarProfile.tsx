import { avatarFallback } from "@/utils/avatar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { memo } from "react";
import { cn } from "@/lib/utils";
import randomColor from "randomcolor";

function AvatarProfile(props: AvatarProfileProps) {
  const {
    photo,
    firstname,
    lastname,
    avatarClassName,
    avatarColor,
    avatarFallbackClassName,
    avatarImageClassName,
    size,
  } = props;
  return (
    <Avatar className={cn(avatarClassName)}>
      <AvatarImage
        className={cn("object-cover", avatarImageClassName)}
        src={photo}
        alt={firstname + " " + lastname}
      />
      <AvatarFallback
        className={avatarFallbackClassName}
        style={{
          backgroundColor:
            avatarColor ||
            randomColor({
              luminosity: "dark",
              alpha: 0.5,
            }),
        }}
      >
        {avatarFallback(firstname || "N", lastname || "A")}
      </AvatarFallback>
    </Avatar>
  );
}

export default memo(AvatarProfile);

type AvatarProfileProps = {
  photo?: string;
  firstname?: string;
  lastname?: string;
  avatarColor?: string;
  avatarClassName?: string;
  avatarFallbackClassName?: string;
  avatarImageClassName?: string;
  size?: number;
};
