import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { avatarFallback } from "@/utils/avatar";
import { AtSign, CalendarCheck, Dot, Flame } from "lucide-react";
import { memo, useState } from "react";

function WorkSchedule({ id, user }: any) {

  return (
    <div className="bg-white mt-3">
      <div className="flex gap-5">
        {user && user.work_schedule && user.work_schedule.map((work: any, index: number) => (
          <div className="bg-teal-50 border-2 border-teal-200 p-1 rounded-app flex items-center gap-1" key={index}>
            <CalendarCheck size={20} className="text-teal-400" />
            <p className="text-teal-500 font-medium">{work.user_work_schedule_name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(WorkSchedule);