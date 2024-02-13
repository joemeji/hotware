
import { Pin } from "lucide-react";
import { memo } from "react";

function UserSkills({ id, user }: any) {
  console.log({ user: user })
  return (
    <div className="bg-white mt-3 flex">
      <div className="w-full flex flex-wrap gap-5 rounded-xl shadow-md p-4 mr-2">
        {user.skills.map((skill: any, index: number) => (
          <div key={index} className="bg-red-50 border-2 border-red-200 p-1 rounded-app flex items-center gap-1">
            <Pin className="text-red-500" size={11} strokeWidth={2.25} />
            <p className="text-red-600 font-medium">{skill.user_skill_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(UserSkills);