import { ScrollArea } from "@/components/ui/scroll-area";
import { createContext, memo, useContext, useState } from "react";
import { AccessTokenContext } from "@/context/access-token-context";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import AvatarProfile from "@/components/AvatarProfile";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useSWR, { mutate } from "swr";
import { useRouter } from "next/router";
import { doc_company_base, doc_employee_base } from "@/lib/azureUrls";
import { cn } from "@/lib/utils";
import { SelectedEmployeeContext } from "@/pages/documents/employees";
import LoadingMore from "@/components/LoadingMore";
import ColumnsHead from "./ColumnsHead";
import Header from "./Header";
import ColumnsBody from "./ColumnsBody";
import { toast } from "@/components/ui/use-toast";

export const CheckedFilesContext = createContext([]);

const List = () => {
  const access_token = useContext(AccessTokenContext);
  const [headerH, setHeaderH] = useState(0);
  const selectedEmployee: any = useContext(SelectedEmployeeContext);
  const router = useRouter();
  const [checkedFiles, setCheckedFiles] = useState([]);

  const urlPayload: any = {};
  if (router.query?.user_id) urlPayload["_user_id"] = router.query?.user_id;

  const parentId = router.query?.parent_id || 0;

  let searchParams = new URLSearchParams(urlPayload);
  const { data, isLoading, error, mutate } = useSWR(
    [
      `/api/document/company/get/${parentId}`,
      access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const onPreview = (dir: any) => {
    const a = document.createElement("a");
    a.target = "_blank";
    a.href = `${doc_company_base}/${dir.document_file_name}`;
    a.click();
  };

  const onDownload = async (dir: any) => {
    const requestOptions = {
      method: 'POST',
      headers: authHeaders(access_token),
      body: JSON.stringify(dir)
    };

    toast({
      title: "Download may take a while, please wait.",
      variant: "success",
      duration: 2000,
    });

    const res = await fetch(`${baseUrl}/api/document/download_document`, requestOptions);
    const blob = await res.blob();

    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = dir.document_file_name;
    a.click();
  };

  return (
    <CheckedFilesContext.Provider value={checkedFiles}>
      <ScrollArea
        className="w-full bg-white rounded-app"
        viewPortClassName="h-[calc(100vh-var(--header-height)-40px)]"
      >
        <Header
          ref={(el: any) => {
            setHeaderH(el?.offsetHeight);
          }}
          onSuccess={() => mutate(data)}
          onDeselect={() => setCheckedFiles([])}
        />

        {isLoading ? (
          <div className="flex justify-center items-center flex-col">
            <LoadingMore />
          </div>
        ) : (
          <table className="w-full">
            <thead className="sticky z-10" style={{ top: headerH + "px" }}>
              <ColumnsHead />
            </thead>
            <tbody>
              {Array.isArray(data?.list) && data.list.length > 0 ? (
                data.list.map((dir: any, key: number) => (
                  <ColumnsBody
                    key={key}
                    dir={dir}
                    onDownload={onDownload}
                    onPreview={onPreview}
                    onCheckedBox={(checkedFiles) => setCheckedFiles(checkedFiles)}
                    onSuccess={() => mutate(data)}
                  />
                ))
              ) : (
                <tr>
                  <TD className="text-center" colspan={10}>No records found.</TD>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </ScrollArea>
    </CheckedFilesContext.Provider>
  );
};

export const TD = ({ className, children, colspan }: { className?: string, children?: React.ReactNode, colspan?: any }) => (
  <td colSpan={colspan} className={cn('py-2 px-2 border-b border-b-stone-100 group-last:border-0', className)}>{children}</td>
);

export const UserAvatar = ({
  firstname,
  lastname,
  avatar_color,
  photo,
  avatarClassName,
  avatarFallbackClassName,
}: {
  firstname: any;
  lastname: any;
  avatar_color: any;
  photo: any;
  avatarClassName?: string;
  avatarFallbackClassName?: string;
}) => {
  if (!firstname || !lastname) return <></>;
  return (
    <TooltipProvider delayDuration={400}>
      <Tooltip>
        <TooltipTrigger>
          <AvatarProfile
            firstname={firstname}
            lastname={lastname}
            avatarColor={avatar_color}
            photo={baseUrl + "/users/thumbnail/" + photo}
            avatarClassName={cn("text-white font-medium", avatarClassName)}
            avatarFallbackClassName={cn(avatarFallbackClassName)}
          />
        </TooltipTrigger>
        <TooltipContent>
          <p>{(firstname || "N") + " " + (lastname || "A")}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default memo(List);
