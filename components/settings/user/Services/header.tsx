import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, File, Forward, X } from "lucide-react";
import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import { forwardRef, memo, useContext, useState } from "react";
import { useRouter } from "next/router";
import { doc_employee_base } from "@/lib/azureUrls";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { SelectedEquipmentContext } from "@/pages/documents/equipment";

const Header = forwardRef(
  (
    {
      selectedService,
      onSuccess,
      onDeselect,
      onDirectory,
    }: {
      onSuccess?: () => void;
      onDeselect?: () => void;
      onDirectory?: any;
      selectedService?: any;
    },
    ref: any
  ) => {
    const { data: session }: any = useSession();
    const router = useRouter();
    const [newFolderOpen, setNewFolderOpen] = useState(false);
    const [newDocumentOpen, setNewDocumentOpen] = useState(false);
    const [onMoveDocument, setOnMoveDocument] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const selectedEquipment: any = useContext(SelectedEquipmentContext);

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
        <div
          ref={ref}
          className="flex justify-between sticky top-0 backdrop-blur z-10"
        >
          <FolderNavs
            onDirectory={(e: any) => onDirectory(e)}
            selectedService={selectedService}
          />
        </div>
      </>
    );
  }
);

Header.displayName = "Header";

export default memo(Header);

const FolderNavs = ({
  onDirectory,
  selectedService,
}: {
  onDirectory?: (e: any) => void;
  selectedService?: any;
}) => {
  const router = useRouter();
  let dirs: any = [];
  const query: any = router.query;
  const search = query.search;
  if (router.query?.dirs) {
    dirs = JSON.parse(query?.dirs);
  }

  const onNavigateItem = () => {
    if (selectedService) {
      onDirectory && onDirectory(true);
      router.push(
        `/settings/user/service?service_id=${selectedService.user_service_id}&parent_id=0&search=${search}`
      );
      onDirectory && onDirectory(true);
    }
  };

  const onNavigateFolder = (dir: any) => {
    const _query: any = {};
    let dirs = jsonDirs();

    if (selectedService) {
      _query.service_id = selectedService.user_service_id;
    }

    _query.parent_id = dir.id;
    _query.search = search;

    if (Array.isArray(dirs)) {
      const currDirIndex = dirs.findIndex((item: any) => item.id === dir.id);
      if (currDirIndex === 0) {
        dirs.splice(1);
      }

      if (currDirIndex > 0) {
        dirs.splice(currDirIndex + 1);
      }

      _query.dirs = JSON.stringify(dirs);
    }

    let searchParams = new URLSearchParams(_query);

    router.push(`/settings/user/service?${searchParams.toString()}`);
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
      {selectedService && (
        <div className="flex gap-1 items-center">
          <span
            className="flex gap-1 items-center hover:underline cursor-pointer font-medium"
            tabIndex={0}
            onClick={onNavigateItem}
          >
            {selectedService.user_service_name}
          </span>
          {Array.isArray(dirs) && dirs.length !== 0 && (
            <ChevronRight className="w-[15px]" />
          )}
        </div>
      )}
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
