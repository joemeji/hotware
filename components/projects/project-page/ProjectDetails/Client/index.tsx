import { TH } from "@/components/items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, Plus, Search, UserSquare, Warehouse } from "lucide-react";
import { useContext, useState } from "react";
import ClientInfo from "./ClientInfo";
import AvatarProfile from "@/components/AvatarProfile";
import useSWR from "swr";
import { useRouter } from "next/router";
import { fetchApi } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { AccessTokenContext } from "@/context/access-token-context";

const Client = ({ headerSize }: { headerSize?: any }) => {
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();
  const _project_id = router.query.project_id;
  const [openNewTask, setOpenNewTask] = useState(false);

  const { data, isLoading, error, mutate } = useSWR(
    [
      _project_id ? `/api/projects/${_project_id}/client` : null,
      access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  console.log({ dataclient: data })

  return (
    <div className="flex items-start gap-[10px] mt-[10px]">
      <ClientInfo
        cms={data && data.project}
      />
      <div className="w-1/2 flex flex-col gap-3">
        <div className="bg-background rounded-xl overflow-hidden">
          <div className="flex justify-between p-3 sticky top-0 z-10 backdrop-blur-sm">
            <p className="font-medium text-lg">Contact Person</p>
          </div>

          <div className="px-5 pb-5 flex flex-wrap gap-[10px]">
            {data && data.contact_persons.map((contact: any, key: number) => (
              <ContactPeron
                contact={contact}
                key={key}
              />
            ))}
          </div>
        </div>

        <div className="bg-background rounded-xl overflow-hidden">
          <div className="flex justify-between p-3 sticky top-0 z-10 backdrop-blur-sm">
            <p className="font-medium text-lg">Requirement Levels</p>
          </div>

          <div className="px-5 pb-5 flex flex-col w-full max-w-[450px]">
            <div className="border rounded-2xl overflow-hidden">
              {data && data.levels.map((level: any, key: number) => (
                <Level
                  level={level.document_level_name}
                  key={key}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Client;

const Level = ({ level }: { level?: any }) => {
  return (
    <div className="border-b last:border-b-0 py-2 px-4 hover:bg-stone-100">
      <span className="font-medium">{level}</span>
    </div>
  );
};

const ContactPeron = ({ contact }: { contact?: any }) => {
  return (
    <div className="flex flex-col border rounded-xl w-[calc(50%-5px)] p-2">
      <div className="flex gap-2 items-center">
        <AvatarProfile
          firstname={contact.cms_employee_firstname}
          lastname={contact.cms_employee_lastname}
          photo={""}
          avatarFallbackClassName="font-medium text-white"
          avatarColor={""}
        />
        <div className="flex gap-1 items-center">
          <p className="text-base font-medium">{contact.cms_employee_firstname} {contact.cms_employee_lastname}</p>
          <span className="opacity-70">({contact.pcc_alias})</span>
        </div>
      </div>

      <div className="flex flex-col gap-1 mt-3">
        <div className="flex gap-2 items-center">
          {contact.cms_name && (
            <>
              <Warehouse className="opacity-60 w-[16px]" strokeWidth={1} />
              <span>{contact.cms_name}</span>
            </>
          )}
        </div>
        <div className="flex gap-2 items-center">
          {contact.cms_employee_phone_number && (
            <>
              <Phone className="opacity-60 w-[16px]" strokeWidth={1} />
              <span>{contact.cms_employee_phone_number}</span>
            </>
          )}

        </div>
        <div className="flex gap-2 items-center">
          {contact.cms_employee_email && (
            <>
              <Mail className="opacity-60 w-[16px]" strokeWidth={1} />
              <span>{contact.cms_employee_email}</span>
            </>
          )}

        </div>
        <div className="flex gap-2 items-center">
          {contact.cms_position_name && (
            <>
              <UserSquare className="opacity-60 w-[16px]" strokeWidth={1} />
              <span>{contact.cms_position_name}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
