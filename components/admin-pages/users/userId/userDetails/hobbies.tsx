
import { Pin, Star } from "lucide-react";
import { memo } from "react";

function UserHobbies({ id, user }: any) {
  console.log({ user: user })
  return (
    <div className="bg-white mt-3 flex">
      <div className="w-full flex flex-wrap gap-5 rounded-xl shadow-md p-4 mr-2">
        {user.hobbies.map((hobby: any, index: number) => (
          <div key={index} className="bg-slate-50 border-2 border-slate-200 p-1 rounded-app flex items-center gap-1">
            <Star className="text-slate-500" size={11} strokeWidth={2.25} />
            <p className="text-slate-600 font-medium">{hobby.user_hobby}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(UserHobbies);