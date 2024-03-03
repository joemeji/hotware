import { Clock, MapPin, MonitorSmartphone } from "lucide-react";
import { Separator } from "../ui/separator";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(timezone);
dayjs.extend(utc);

const guessedTZ = dayjs.tz.guess();

export default function LoginDetails() {
  const { data: session } = useSession();

  const loginDetails = useMemo<any>(() => {
    const user: any = session?.user;
    if (user?.login_details) {
      return user?.login_details;
    }
    return null;
  }, [session]);

  const loginLocation = useMemo<any>(() => {
    if (loginDetails?.location) {
      return JSON.parse(loginDetails?.location);
    }
    return null;
  }, [loginDetails]);

  const loginLoc = () => {
    if (
      !loginLocation?.country ||
      !loginLocation?.region ||
      !loginLocation?.city
    ) {
      return "-";
    }

    const loc = [
      loginLocation?.city || null,
      loginLocation?.region || null,
      loginLocation?.country || null,
    ];

    return loc.filter((item: any) => item).join(", ");
  };

  const loginTime = useMemo(() => {
    const date = dayjs(loginDetails?.date).tz(
      loginLocation?.timezone || guessedTZ
    );

    return date.format("MMMM DD, YYYY HH:mm");
  }, [loginDetails, loginLocation]);

  return (
    <div className="w-1/2 bg-white rounded-xl shadow-sm p-4">
      <div className="flex items-center gap-2">
        <MonitorSmartphone className="w-[30px] h-[30px]" strokeWidth={1.5} />
        <p className="font-medium text-base capitalize">
          Logged in on {loginDetails?.device || "unknown"}
        </p>
      </div>
      <Separator className="my-2" />
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <MapPin className="w-[18px] h-[18px]" strokeWidth={1} />
          <p className="opacity-90">{loginLoc()}</p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-[18px] h-[18px]" strokeWidth={1} />
          <p className="opacity-90">{loginTime}</p>
        </div>
      </div>
    </div>
  );
}
