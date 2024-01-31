import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { avatarFallback } from "@/utils/avatar";
import { AtSign, Dot, Flame } from "lucide-react";

export default function ProfileInfo() {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="relative bg-[url('https://images.pexels.com/photos/15153567/pexels-photo-15153567/free-photo-of-horses-on-green-grass-field.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')] bg-cover h-[200px] w-full rounded-tl-xl rounded-tr-xl">
      
      </div>
      <div className="-mt-12 px-5 pb-5">
        <div className="flex justify-between items-end mt-3">
          <Avatar className="w-24 h-24 border-4 border-white">
            <AvatarImage src="sds" alt="Test name" />
            <AvatarFallback className="font-medium text-white text-2xl" style={{ background: '#4f46e5' }}>
              {avatarFallback('Joemy', 'Flores')}
            </AvatarFallback>
          </Avatar>
          <div className="z-10">
            <Button>Edit Profile</Button>
          </div>
        </div>
        
        <div className="flex flex-col gap-2">
          <div>
            <p className="text-2xl font-medium">Joemy Jay Flores</p>
            <p className="flex items-center gap-2">
              <AtSign className="text-blue-400 w-4 h-4" /> 
              <span className="text-stone-500 text-sm">joemy.flores@hotwork.asia</span>
            </p>
          </div>

          <div className="flex items-center">
            <p className="flex gap-2 items-center">
              <Flame className="text-red-400 w-4 h-4 fill-red-400" /> 
              <span className="text-stone-800 font-medium">Hotwork International Inc. (Philippines)</span>
            </p>

            <Dot className="text-stone-300" />

            <div className="flex items-center">
              <span className="text-stone-500">Web Developer</span>
              <Dot className="text-stone-300" />
              <p className="flex gap-2 items-center">
                <span className="text-stone-500">Full Time</span>
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}