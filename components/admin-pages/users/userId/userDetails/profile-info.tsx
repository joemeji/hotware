import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { avatarFallback } from "@/utils/avatar";
import { AtSign, Dot, Flame } from "lucide-react";
import { memo } from "react";
import { baseUrl } from "@/utils/api.config";

function ProfileInfo(props: ProfileInfoProps) {
  const { user } = props;
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="relative bg-[url('https://images.pexels.com/photos/15153567/pexels-photo-15153567/free-photo-of-horses-on-green-grass-field.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover h-[200px] w-full rounded-tl-xl rounded-tr-xl">

      </div>
      <div className="-mt-12 px-5 pb-5">
        <div className="flex justify-between items-end mt-3">
          <Avatar className="w-24 h-24 border-4 border-white">
            <AvatarImage src={`${baseUrl}/users/thumbnail/${user.user_photo}`} alt={user.user_lastname + ' ' + user.user_lastname} />
            <AvatarFallback className="font-medium text-white text-2xl" style={{ background: '#4f46e5' }}>
              {avatarFallback(user.user_firstname, user.user_lastname)}
            </AvatarFallback>
          </Avatar>
          <div className="z-10">
            <Button>Edit Profile</Button>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <p className="text-2xl font-medium">{user.user_firstname} {user.user_lastname}</p>
            <p className="flex items-center gap-2">
              <AtSign className="text-blue-400 w-4 h-4" />
              <span className="text-stone-500 text-sm">{user.user_email_address}</span>
            </p>
          </div>

          <div className="flex items-center">
            <p className="flex gap-2 items-center">
              <Flame className="text-red-400 w-4 h-4 fill-red-400" />
              <span className="text-stone-800 font-medium">{user.company_name}</span>
            </p>

            <Dot className="text-stone-300" />

            <div className="flex items-center">
              <span className="text-stone-500">{user.role_name}</span>
              <Dot className="text-stone-300" />
              <p className="flex gap-2 items-center">
                <span className="text-stone-500">{user.user_employed_type}</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default memo(ProfileInfo);

type ProfileInfoProps = {
  user?: any
}