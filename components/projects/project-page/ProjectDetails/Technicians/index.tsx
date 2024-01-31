import AvatarProfile from "@/components/AvatarProfile";
import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AccessTokenContext } from "@/context/access-token-context";
import { cn } from "@/lib/utils";
import { ProjectDetailsContext } from "@/pages/projects/[project_id]";
import { baseUrl, fetchApi } from "@/utils/api.config";
import { BellPlus, MoreVertical, Pencil, Trash } from "lucide-react";
import { useContext, useMemo } from "react";
import useSWR from "swr";

const Technicians = ({ headerSize }: { headerSize?: any }) => {
  const payload: any = {};
  const queryString = new URLSearchParams(payload).toString();
  const project = useContext(ProjectDetailsContext);
  const access_token = useContext(AccessTokenContext);

  const { data, isLoading, error } = useSWR(
    [
      project.data &&
        `/api/projects/${project.data?._project_id}/technician?${queryString}`,
      access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return (
    <div className="flex flex-col gap-2 mt-2">
      <div className="flex justify-between bg-background p-3 rounded-xl">
        <p className="text-base font-medium">Technicians</p>
      </div>

      <div className="columns-4 gap-[10px]">
        {Array.isArray(data?.list) &&
          data.list.map((item: any, key: number) => (
            <Technician
              key={key}
              user_firstname={item.user_firstname}
              user_lastname={item.user_lastname}
              avatar_color={item.avatar_color}
              user_photo={item.user_photo}
              isDataProtection={item.isDataProtection}
              isConsent={item.isConsent}
              isSignature={item.isSignature}
              project_role_name={item.project_role_name}
              project_second_role_name={item.project_second_role_name}
            />
          ))}
      </div>
    </div>
  );
};

export default Technicians;

const Technician = ({
  user_lastname,
  user_firstname,
  user_photo,
  avatar_color,
  isDataProtection,
  isConsent,
  isSignature,
  project_role_name,
  project_second_role_name,
}: {
  user_firstname?: any;
  user_lastname?: any;
  user_photo?: any;
  avatar_color?: any;
  isDataProtection?: "accepted" | "not_accepted";
  isConsent?: "accepted" | "not_accepted";
  isSignature?: "accepted" | "not_accepted";
  project_role_name?: any;
  project_second_role_name?: any;
}) => {
  return (
    <div className="grid grid-rows-[2fr_auto] break-inside-avoid mb-[10px]">
      <div className="flex flex-col bg-white rounded-xl w-full shadow-sm">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between ps-4 pe-1 py-3 items-start">
            <div className="flex items-center gap-2">
              <AvatarProfile
                firstname={user_firstname}
                lastname={user_lastname}
                photo={baseUrl + "/users/thumbnail/" + user_photo}
                avatarFallbackClassName="font-medium text-white"
                avatarColor={avatar_color}
              />
              <p
                className=" w-[150px] whitespace-nowrap overflow-hidden text-ellipsis"
                title={`${user_firstname || ""} ${user_lastname || ""}`}
              >
                {user_firstname} {user_lastname}
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Button className="py-1">Add Scope</Button>
              <MoreOption
                menuTriggerChildren={
                  <Button variant={"ghost"} className="px-2 py-1">
                    <MoreVertical strokeWidth={1.5} className="w-[18px]" />
                  </Button>
                }
              >
                <ItemMenu className="flex gap-3 items-center">
                  <Pencil className="w-[18px]" strokeWidth={1} />
                  <span className="font-medium">Update</span>
                </ItemMenu>
                <ItemMenu className="flex gap-3 items-center">
                  <Trash className="w-[18px]" strokeWidth={1} />
                  <span className="font-medium">Delete</span>
                </ItemMenu>
                <Separator className="my-2" />
                <ItemMenu className="flex gap-3 items-center">
                  <BellPlus className="w-[18px]" strokeWidth={1} />
                  <span className="font-medium">Send Notification</span>
                </ItemMenu>
              </MoreOption>
            </div>
          </div>

          {project_role_name && (
            <div className="flex px-4 flex-col gap-1">
              <p className="text-stone-500">Role: </p>
              <div className="bg-stone-50 p-2 rounded-app font-medium">
                <p>{project_role_name}</p>
              </div>
            </div>
          )}

          {project_second_role_name && (
            <div className="flex px-4 flex-col gap-1">
              <p className="text-stone-500">Second Role: </p>
              <div className="bg-stone-50 p-2 rounded-app font-medium">
                <p>{project_second_role_name}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col mt-3">
            <div className="border-t flex items-center justify-between py-3 px-3">
              <p className="text-stone-500">GDPR</p>
              <TechConsent consent={isDataProtection} />
            </div>
            <div className="border-t flex items-center justify-between py-3 px-3">
              <p className="text-stone-500">Consent (Hotware)</p>
              <TechConsent consent={isConsent} />
            </div>
            <div className="border-t flex items-center justify-between py-3 px-3">
              <p className="text-stone-500">Signature</p>
              <TechConsent consent={isSignature} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const TechConsent = ({
  consent,
}: {
  consent?: "not_accepted" | "accepted";
}) => {
  let consentColor = useMemo(() => {
    let color: string = "";
    if (consent === "accepted") color = "22, 163, 74";
    if (consent === "not_accepted") color = "220, 38, 38";

    return color;
  }, [consent]);

  if (!consentColor) return <></>;

  return (
    <div
      className={cn(
        "bg-[rgba(var(--bg-hover),0.08)] text-[rgba(var(--bg-hover))] w-fit px-3 py-[2px] rounded-full",
        "flex items-center font-medium text-[12px]"
      )}
      ref={(el) => {
        el?.style.setProperty("--bg-hover", consentColor);
      }}
    >
      Not Accepted
    </div>
  );
};
