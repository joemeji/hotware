import { ScrollArea } from "@/components/ui/scroll-area";
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { doc_equipment_base } from "@/lib/azureUrls";
import { cn } from "@/lib/utils";
import ColumnsBody from "./ColumnsBody";
import ColumnsHead from "./ColumnsHead";
import { SelectedEmployeeContext } from "@/pages/documents/employees";
import LoadingMore from "@/components/LoadingMore";
import Header from "./header";
import { SelectedEquipmentContext } from "@/pages/documents/equipment";
import { toast } from "@/components/ui/use-toast";
import EquipmentToAdd from "@/components/projects/project-page/ProjectDetails/Equipments/EquipmentToAdd";
import ItemBlockSelect from "@/components/app/item-block-select";
import useSize from "@/hooks/useSize";

export const CheckedFilesContext = createContext([]);

const List = ({
  filterHeight,
  onClickEquipment,
}: {
  filterHeight?: any;
  onClickEquipment?: (item: any) => void;
}) => {
  const access_token = useContext(AccessTokenContext);
  const cateRef = useRef<any>(null);
  const cateSize: any = useSize(cateRef);
  const headingRef = useRef<any>(null);
  const headingSize: any = useSize(headingRef);
  const bottomRef = useRef<any>(null);
  const bottomSize: any = useSize(bottomRef);
  const [headerH, setHeaderH] = useState(0);
  const [selectedItems, setSelectedItems] = useState<any>(null);
  const selectedEquipment: any = useContext(SelectedEquipmentContext);
  const router = useRouter();
  const [checkedFiles, setCheckedFiles] = useState([]);
  const [redirect, setRedirect] = useState(false);
  const [search, setSearch] = useState("");

  const urlPayload: any = {};
  urlPayload["search"] = search;
  if (router.query?.user_id) urlPayload["_user_id"] = router.query?.user_id;

  const parentId = router.query?.parent_id || 0;
  const itemID = router.query?.item_id;

  let searchParams = new URLSearchParams(urlPayload);

  const { data, isLoading, error, mutate } = useSWR(
    [
      itemID || parentId
        ? `/api/document/equipment/get/${parentId}/${itemID}?${searchParams.toString()}`
        : null,
      access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  useEffect(() => {
    if (redirect) {
      mutate(data);
    }
  }, [redirect, data, mutate]);

  useEffect(() => {
    if (itemID) {
      setSelectedItems([{ _item_id: itemID }]);
    }
  }, [itemID]);

  const onPreview = (dir: any) => {
    if (dir.document_file_name) {
      const a = document.createElement("a");
      a.target = "_blank";
      a.href = `${doc_equipment_base}/${dir.document_file_name}`;
      a.click();
    } else {
      toast({
        title: "Problem encounter upon viewing file.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const onDownload = async (dir: any) => {
    if (dir.document_file_name) {
      const requestOptions = {
        method: "POST",
        headers: authHeaders(access_token),
        body: JSON.stringify(dir),
      };

      toast({
        title: "Download may take a while, please wait.",
        variant: "success",
        duration: 2000,
      });

      const res = await fetch(
        `${baseUrl}/api/document/download_document`,
        requestOptions
      );
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = dir.document_file_name;
      a.click();
    } else {
      toast({
        title: "Problem encounter while downloading file.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  return (
    <CheckedFilesContext.Provider value={checkedFiles}>
      <div
        className="bg-background flex flex-col rounded-xl w-[28%]"
        style={{
          height: `calc(100vh - var(--header-height) - ${filterHeight?.height}px - 50px)`,
        }}
        ref={cateRef}
      >
        <div ref={headingRef}>
          <p className="font-medium text-base flex items-center py-3 px-3">
            Select Equipments
          </p>
        </div>
        <ItemBlockSelect
          height={cateSize?.height - headingSize?.height - bottomSize?.height}
          selectedItems={selectedItems}
          onSelectItems={(items: any) => {
            if (items.length != 0) {
              setSelectedItems(items);
              onClickEquipment && onClickEquipment(items[0]);
              router.push(
                `/documents/equipment?item_id=${items[0]._item_id}&parent_id=0`
              );
            }
          }}
          multiple={false}
        />
        <div ref={bottomRef} className="mt-auto"></div>
      </div>
      <ScrollArea
        className="w-[75%] bg-white rounded-app"
        viewPortClassName="h-[calc(100vh-var(--header-height)-40px)]"
      >
        <Header
          ref={(el: any) => {
            setHeaderH(el?.offsetHeight);
          }}
          onSuccess={() => {
            mutate(data);
            setCheckedFiles([]);
          }}
          onDeselect={() => setCheckedFiles([])}
          onDirectory={(redirect: any) => {
            setRedirect(redirect);
          }}
          onSearch={(search: any) => setSearch(search)}
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
                    onCheckedBox={(checkedFiles) =>
                      setCheckedFiles(checkedFiles)
                    }
                    onSuccess={() => mutate(data)}
                  />
                ))
              ) : (
                <tr>
                  <TD className="text-center" colspan={10}>
                    No records found.
                  </TD>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </ScrollArea>
    </CheckedFilesContext.Provider>
  );
};

export const TD = ({
  className,
  children,
  colspan,
}: {
  className?: string;
  children?: React.ReactNode;
  colspan?: any;
}) => (
  <td
    colSpan={colspan}
    className={cn(
      "py-2 px-2 border-b border-b-stone-100 group-last:border-0",
      className
    )}
  >
    {children}
  </td>
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
