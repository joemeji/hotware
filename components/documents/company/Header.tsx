import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, File, Forward, X } from "lucide-react";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { forwardRef, memo, useContext, useState } from "react";
import { SelectedEmployeeContext } from "@/pages/documents/employees";
import { useRouter } from "next/router";
import { doc_employee_base } from "@/lib/azureUrls";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { CheckedFilesContext } from "./List";
import NewFolderModal from "./modals/FolderModal/NewFolderModal";
import NewDocument from "./modals/DocumentModal/NewDocument";
import MoveDocument from "./modals/FolderModal/MoveDocument";
import { truncate } from "@/utils/text";
import SearchInput from "@/components/app/search-input";

const Header = forwardRef(
  (
    {
      onSuccess,
      onDeselect,
      onDirectory,
      onSearch,
    }: {
      onSuccess?: () => void;
      onDeselect?: () => void;
      onDirectory?: (e: any) => void;
      onSearch?: (search: any) => void;
    },
    ref: any
  ) => {
    const { data: session }: any = useSession();
    const router = useRouter();
    const [newFolderOpen, setNewFolderOpen] = useState(false);
    const [newDocumentOpen, setNewDocumentOpen] = useState(false);
    const [onMoveDocument, setOnMoveDocument] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const checkedFiles: any = useContext(CheckedFilesContext);

    const onDownloadAsZip = async (e: any) => {
      e.preventDefault();
      setIsDownloading(true);
      const requestOptions = {
        method: "POST",
        headers: authHeaders(session.user.access_token),
        body: JSON.stringify(checkedFiles),
      };

      const res = await fetch(
        `${baseUrl}/api/document/download_files`,
        requestOptions
      );
      const blob = await res.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `FILES_${getDateToday()}.zip`;
      a.click();
      setIsDownloading(false);
    };

    function getDateToday() {
      const currentDate = new Date();

      const year = currentDate.getFullYear();
      const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-indexed
      const day = currentDate.getDate().toString().padStart(2, "0");
      const hours = currentDate.getHours().toString().padStart(2, "0");
      const minutes = currentDate.getMinutes().toString().padStart(2, "0");
      const seconds = currentDate.getSeconds().toString().padStart(2, "0");

      const dateNow = `${year}${month}${day}${hours}${minutes}${seconds}`;
      return dateNow;
    }

    return (
      <>
        {newFolderOpen && (
          <NewFolderModal
            open={newFolderOpen}
            onOpenChange={(open) => setNewFolderOpen(open)}
            onSuccess={onSuccess}
          />
        )}
        {newDocumentOpen && (
          <NewDocument
            open={newDocumentOpen}
            onOpenChange={(open) => setNewDocumentOpen(open)}
            onSuccess={onSuccess}
          />
        )}
        {onMoveDocument && (
          <MoveDocument
            open={onMoveDocument}
            onOpenChange={(open) => setOnMoveDocument(open)}
            onSuccess={() => {
              onSuccess && onSuccess();
              onDeselect && onDeselect();
            }}
          />
        )}
        <div
          ref={ref}
          className="flex flex-col justify-between p-3 sticky top-0 backdrop-blur z-10 gap-2"
        >
          <div className="font-medium text-lg">
            <p>Company Documents</p>
          </div>
          <div className="flex justify-between">
            {Array.isArray(checkedFiles) && checkedFiles.length > 0 ? (
              <div className="flex gap-1">
                <Button
                  className="py-1 flex gap-2 ps-2 pe-3"
                  variant={"secondary"}
                  onClick={() => setOnMoveDocument(true)}
                >
                  <Forward className="w-[18px] text-red-400" /> Move
                </Button>
                <form action="" method="post" onSubmit={onDownloadAsZip}>
                  <Button
                    className={`py-1 gap-2 ps-2 pe-3 ${
                      isDownloading ? "loading" : ""
                    }`}
                    variant={"secondary"}
                    type="submit"
                  >
                    <Download className="w-[18px] text-blue-400" /> Download
                  </Button>
                </form>
                <Button
                  className={`py-1 gap-2 ps-2 pe-3`}
                  variant={"secondary"}
                  onClick={() => onDeselect && onDeselect()}
                >
                  <X className="w-[18px] text-rose-400" /> Deselect
                </Button>
              </div>
            ) : (
              <FolderNavs
                onDirectory={(e: any) => onDirectory && onDirectory(e)}
              />
            )}

            <div className="flex gap-2">
              <MoreOption
                menuTriggerChildren={
                  <Button className="py-1 flex gap-1 px-2 ps-3">
                    <span>New</span>
                    <ChevronDown className="w-[18px]" />
                  </Button>
                }
              >
                <ItemMenu
                  className="gap-3"
                  onClick={() => setNewFolderOpen(true)}
                >
                  <Folder className="w-[18px] h-[18px] fill-orange-300 stroke-orange-300" />
                  <span className="font-medium">Folder</span>
                </ItemMenu>
                <ItemMenu
                  className="gap-3"
                  onClick={() => setNewDocumentOpen(true)}
                >
                  <File className="w-[18px] h-[18px] fill-red-500 stroke-red-600" />
                  <span className="font-medium">Document</span>
                </ItemMenu>
              </MoreOption>
              <SearchInput
                onChange={(e) => onSearch && onSearch(e.target.value)}
                delay={500}
              />
            </div>
          </div>
        </div>
      </>
    );
  }
);

Header.displayName = "Header";

export default memo(Header);

const FolderNavs = ({ onDirectory }: { onDirectory?: (e: any) => void }) => {
  const router = useRouter();
  let dirs: any = [];
  const query: any = router.query;

  if (router.query?.dirs) {
    dirs = JSON.parse(query?.dirs);
  }

  const onNavigateUser = () => {
    onDirectory && onDirectory(true);
    router.push(`/documents/company?parent_id=0`);
    onDirectory && onDirectory(true);
  };

  const onNavigateFolder = (dir: any) => {
    const _query: any = {};
    let dirs = jsonDirs();

    _query.parent_id = dir.id;

    if (Array.isArray(dirs)) {
      const currDirIndex = dirs.findIndex((item: any) => item.id === dir.id);
      if (currDirIndex === 0) {
        dirs.splice(1);
      }

      if (currDirIndex > 0) {
        dirs.splice(currDirIndex);
      }

      _query.dirs = JSON.stringify(dirs);
    }

    let searchParams = new URLSearchParams(_query);

    router.push(`/documents/company?${searchParams.toString()}`);
  };

  const jsonDirs = () => {
    const query: any = { ...router.query };
    try {
      if (query.dirs) {
        return JSON.parse(query.dirs);
      }
      return [];
    } catch (err) {
      return [];
    }
  };

  return (
    <div className="flex gap-1 items-center">
      <div className="flex gap-1 items-center">
        <span
          className="flex gap-1 items-center hover:underline cursor-pointer font-medium"
          tabIndex={0}
          onClick={onNavigateUser}
        >
          Base Path
        </span>
        <ChevronRight className="w-[15px]" />
      </div>
      {Array.isArray(dirs) &&
        dirs.map((item: any, key: number) => (
          <div className="flex gap-1" key={key}>
            <span
              className="hover:underline cursor-pointer"
              tabIndex={0}
              onClick={() => onNavigateFolder(item)}
            >
              {item.name}
            </span>
            {key !== dirs.length - 1 && <ChevronRight className="w-[15px]" />}
          </div>
        ))}
    </div>
  );
};
