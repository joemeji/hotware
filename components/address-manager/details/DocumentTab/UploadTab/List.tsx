import { ItemMenu, TD, TH } from "@/components/items";
import { getFileIconPath } from "@/lib/fileIcons";
import { CmsDetailsContext } from "@/pages/address-manager/[cms_id]";
import { authHeaders, baseUrl, fetcher } from "@/utils/api.config";
import Image from "next/image";
import { memo, useContext, useState } from "react";
import useSWR from "swr";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AvatarProfile from "@/components/AvatarProfile";
import MoreOption from "@/components/MoreOption";
import Pagination from "@/components/pagination";
import { Download, Search, Trash, UploadCloud } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import UploadModal from "./UploadModal";
import { AccessTokenContext } from "@/context/access-token-context";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { base } from "@/lib/azureUrls";

const List = () => {
  const cms: any = useContext(CmsDetailsContext);
  const [page, setPage] = useState(1);
  const [openUploadModal, setOpenUploadModal] = useState(false);
  const access_token = useContext(AccessTokenContext);
  const [loadingIndex, setLoadingIndex] = useState(-1);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<any>(false);
  const [loadingDeleteBtn, setLoadingDeleteBtn] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);

  const queryString = new URLSearchParams({ page: String(page) }).toString();

  let { data, isLoading, error, mutate } = useSWR(
    `/api/cms/${cms?._cms_id}/file?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const fileIcon = (filename: any) => {
    if (filename) {
      const ext = filename.split(".").pop();
      return getFileIconPath(ext);
    }
    return getFileIconPath("unknown");
  };

  const onDownload = async (cms_file: any, index: number) => {
    setLoadingIndex(index);

    const a = document.createElement("a");
    a.href = base + `/cms/${cms_file?.cms_file_name}`;
    a.download = cms_file?.cms_file_name;
    a.click();

    setLoadingIndex(-1);
  };

  const onForceDelete = async () => {
    setLoadingDeleteBtn(true);
    try {
      let url = `${baseUrl}/api/cms/file/${selectedFile?.cms_file_id}/delete`;

      const res = await fetch(url, {
        method: "POST",
        headers: authHeaders(access_token),
      });
      const json = await res.json();
      if (json.success) {
        mutate(data);
        toast({
          title: "File successfully deleted.",
          variant: "success",
          duration: 1000,
        });
        setOpenDeleteAlert(false);
      }
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoadingDeleteBtn(false);
    }
  };

  return (
    <>
      <UploadModal
        open={openUploadModal}
        onOpenChange={(open: any) => setOpenUploadModal(open)}
        onSuccess={() => mutate(data)}
      />

      <AlertDialog
        open={openDeleteAlert}
        onOpenChange={(open: any) => {
          if (!open) setSelectedFile(null);
        }}
      >
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {"You won't be able to revert this."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={loadingDeleteBtn}
              onClick={() => setOpenDeleteAlert(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onForceDelete}
              disabled={loadingDeleteBtn}
              className={cn(loadingDeleteBtn && "loading")}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex justify-between items-center py-2 px-3">
        <span className="text-base font-medium">Uploads</span>
        <div className="flex items-center">
          <Button
            variant={"ghost"}
            className="flex gap-3 items-center py-1 px-2 rounded-full"
          >
            <Search className="text-stone-500 w-[18px]" />
          </Button>
          <Button
            variant={"secondary"}
            className="flex gap-2 items-center py-1 px-2.5"
            onClick={() => setOpenUploadModal(true)}
          >
            <UploadCloud className="text-purple-500 w-[18px]" /> Upload File
          </Button>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr>
            <TH className="ps-4">Title</TH>
            <TH>Filename</TH>
            <TH>Added By</TH>
            <TH className="text-right">Actions</TH>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data?.files) && data.files.length === 0 && (
            <tr>
              <td colSpan={4}>
                <div className="flex justify-center">
                  <Image
                    src="/images/No data-rafiki.svg"
                    width={300}
                    height={300}
                    alt="No Data to Shown"
                  />
                </div>
              </td>
            </tr>
          )}
          {isLoading && (
            <tr>
              <td className="p-2 pt-3 text-center" colSpan={4}>
                <div className="flex flex-col gap-2 items-center">
                  <Skeleton className="w-[250px] h-[20px]" />
                  <Skeleton className="w-[100px] h-[20px]" />
                </div>
              </td>
            </tr>
          )}
          {Array.isArray(data?.files) &&
            data.files.map((file: any, key: number) => (
              <tr key={key} className="group hover:bg-stone-100">
                <TD className="ps-4 group-last:border-b-0">
                  <span className="font-medium">{file.cms_file_title}</span>
                </TD>
                <TD className="group-last:border-b-0">
                  <div className="flex items-center gap-2">
                    <Image
                      src={fileIcon(file.cms_file_name)}
                      width={30}
                      height={30}
                      alt=""
                    />
                    <span>{file.cms_file_name?.substr(15)}</span>
                  </div>
                </TD>
                <TD className="group-last:border-b-0">
                  <TooltipProvider delayDuration={400}>
                    <Tooltip>
                      <TooltipTrigger>
                        <AvatarProfile
                          firstname={file.user_firstname}
                          lastname={file.user_lastname}
                          photo={
                            baseUrl + "/users/thumbnail/" + file.user_photo
                          }
                          avatarClassName="w-10 h-10"
                          avatarColor={file.avatar_color}
                          avatarFallbackClassName="font-medium text-white text-xs"
                        />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {(file.user_firstname || "N") +
                            " " +
                            (file.user_lastname || "A")}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TD>
                <TD className="text-right group-last:border-b-0">
                  <Button
                    className={cn(
                      "py-1 px-2",
                      loadingIndex === key && "loading"
                    )}
                    variant={"ghost"}
                    disabled={loadingIndex === key}
                    onClick={() => onDownload(file, key)}
                  >
                    <Download className="w-[18px] h-[18px] " />
                  </Button>
                  <MoreOption>
                    <ItemMenu
                      className="gap-3"
                      onClick={() => {
                        setOpenDeleteAlert(true);
                        setSelectedFile(file);
                      }}
                    >
                      <Trash className="w-[18px] h-[18px] text-red-500" />
                      <span className="font-medium">Delete</span>
                    </ItemMenu>
                  </MoreOption>
                </TD>
              </tr>
            ))}
        </tbody>
      </table>
      {data && data.pager && (
        <div className="mt-auto border-t border-t-stone-100">
          <Pagination
            pager={data.pager}
            onPaginate={(page) => setPage(page)}
            currPage={page}
          />
        </div>
      )}
    </>
  );
};

export default memo(List);
