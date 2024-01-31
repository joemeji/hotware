import { ItemMenu, TD } from "@/components/items";
import { Checkbox } from "@/components/ui/checkbox";
import { SelectedEmployeeContext } from "@/pages/documents/employees";
import dayjs from "dayjs";
import { memo, useContext, useState } from "react";
import { CheckedFilesContext, UserAvatar } from ".";
import { useRouter } from "next/router";
import {
  FolderClosed,
  File as FileIcon,
  Pencil,
  Trash,
  MoveUpRight,
  Eye,
  Download,
  Bell,
} from "lucide-react";
import MoreOption from "@/components/MoreOption";
import { mutate } from "swr";
import { base } from "@/lib/azureUrls";
import { doesNotReject } from "assert";
import Image from "next/image";
import { baseUrl } from "@/utils/api.config";
import EditFolderModal from "../modals/FolderModal/EditFolderModal";
import { DeleteFolderModal } from "../modals/FolderModal/DeleteFolderModal";
import EditDocumentModal from "../modals/DocumentModal/EditDocumentModal";
import { DeleteDocument } from "../modals/DocumentModal/DeleteDocumentModal";
import DocumentDetailsModal from "../modals/DocumentModal/DocumentDetailsModal";

const ColumnsBody = ({
  dir,
  onPreview,
  onDownload,
  onUpdate,
  onSendApproval,
  onDelete,
  onOpenDetails,
  onCheckedBox,
  onSuccess
}: {
  dir: any;
  onPreview?: (dir: any) => void;
  onDownload?: (dir: any) => void;
  onUpdate?: (dir: any) => void;
  onSendApproval?: (dir: any) => void;
  onDelete?: (dir: any) => void;
  onOpenDetails?: (dir: any) => void;
  onCheckedBox?: (files: any) => void;
  onSuccess?: (succes: boolean) => void;
}) => {
  const selectedEmployee: any = useContext(SelectedEmployeeContext);
  const checkedFiles: any = useContext(CheckedFilesContext);
  const [onEditDirectoryFolder, setOnEditDirectoryFolder] = useState(false);
  const [onEditDocument, setOnEditDocument] = useState(false);
  const [onDeleteDirectoryFolder, setOnDeleteDirectoryFolder] = useState(false);
  const [onDeleteDocument, setOnDeleteDocument] = useState(false);
  const [onViewDocumentDetails, setOnViewDocumentDetails] = useState(false);

  console.log({ dir: dir })

  const expiryDate = (date: any) => {
    if (!date) return "";
    return dayjs(date).format("DD/MM/YYYY");
  };

  const checkedBox = () => {
    if (Array.isArray(checkedFiles)) {
      const checkedIndex = checkedFiles.findIndex(
        (item: any) => item.id === dir.id
      );
      return checkedIndex > -1;
    }
    return false;
  };

  const _onCheckedBox = (checked: boolean) => {
    if (Array.isArray(checkedFiles)) {
      const _checkedFiles = [...checkedFiles];
      const checkedIndex = _checkedFiles.findIndex(
        (item: any) => item.id === dir.id
      );

      if (checked && checkedIndex === -1) {
        _checkedFiles.push({
          id: dir.id,
          name: dir.name,
        });
      }

      if (!checked && checkedIndex > -1) {
        _checkedFiles.splice(checkedIndex, 1);
      }

      onCheckedBox && onCheckedBox(_checkedFiles);
      return;
    }

    onCheckedBox && onCheckedBox([]);
  };

  const onPreviewDocument = async (filename: any) => {
    const a = document.createElement("a");
    a.href = base + `/documents/equipment/${filename}`;;
    a.target = "_blank";
    a.click();
  };

  return (
    <tr className="hover:bg-stone-100">
      {onViewDocumentDetails && (
        <DocumentDetailsModal
          open={onViewDocumentDetails}
          onOpenChange={(open: any) => setOnViewDocumentDetails(open)}
          document={dir && dir}
        />
      )}
      {onDeleteDocument && (
        <DeleteDocument
          open={onDeleteDocument}
          onOpenChange={(open: any) => setOnDeleteDocument(open)}
          onSuccess={onSuccess}
          document={dir && dir}
        />
      )}
      {onEditDirectoryFolder && (
        <EditFolderModal
          open={onEditDirectoryFolder}
          onOpenChange={(open: any) => setOnEditDirectoryFolder(open)}
          dir={dir && dir}
          onSuccess={() => onSuccess && onSuccess(true)}
        />
      )}
      {onDeleteDirectoryFolder && (
        <DeleteFolderModal
          open={onDeleteDirectoryFolder}
          onOpenChange={(open: any) => setOnDeleteDirectoryFolder(open)}
          dir={dir && dir}
          onSuccess={() => onSuccess && onSuccess(true)}
        />
      )}
      {onEditDocument && (
        <EditDocumentModal
          open={onEditDocument}
          onOpenChange={(open: any) => setOnEditDocument(open)}
          onSuccess={onSuccess}
          document={dir && dir}
        />
      )}
      <TD className="border">
        {dir.is_dir == 0 && (
          <div className="flex justify-center items-center">
            <Checkbox
              className="mb-0 rounded-none w-[16px] h-[16px]"
              onCheckedChange={(checked: any) => _onCheckedBox(checked)}
              checked={checkedBox()}
            />
          </div>
        )}
      </TD>

      <TD className="border">
        {dir.is_dir == 1 && <Directory dir={dir} />}
        {dir.is_dir == 0 && (
          <File
            name={dir.name}
            filename={dir.document_file_name}
            onClick={() => onPreviewDocument(dir.document_file_name)}
          />
        )}
      </TD>
      <TD className="border">
        <div
          title={dir.category || ""}
          className="w-[150px] whitespace-nowrap overflow-hidden text-ellipsis"
        >
          {dir.category || ""}
        </div>
      </TD>
      <TD className="border">{dir.language || ""}</TD>
      <TD className="border">{expiryDate(dir.expiry_date)}</TD>
      <TD className="border">
        <div className="flex justify-center">
          <UserAvatar
            firstname={dir.updated_owner_firstname}
            lastname={dir.updated_owner_lastname}
            avatar_color={dir.updated_avatar_color}
            photo={dir.updated_photo}
          />
        </div>
      </TD>
      <TD className="border">{expiryDate(dir.modified_date)}</TD>
      <TD className="text-center">
        <div dangerouslySetInnerHTML={{ __html: dir.status }} />
      </TD>
      <TD className="text-right pe-4">
        <MoreOption>
          <ItemMenu className="gap-3" onClick={() => {
            onUpdate && onUpdate(dir);
            if (dir.is_dir == 1) {
              setOnEditDirectoryFolder(true);
            } else {
              setOnEditDocument(true);
            }
          }}>
            <Pencil className="w-[18px] h-[18px] text-stone-500" />
            <span className="font-medium">Update</span>
          </ItemMenu>
          <ItemMenu className="gap-3" onClick={() => {
            onDelete && onDelete(dir);
            if (dir.is_dir == 1) {
              setOnDeleteDirectoryFolder(true);
            } else {
              setOnDeleteDocument(true);
            }
          }}>
            <Trash className="w-[18px] h-[18px] text-stone-500" />
            <span className="font-medium">Delete</span>
          </ItemMenu>
          {dir.is_dir == 0 && (
            <>
              <ItemMenu
                className="gap-3"
                onClick={() => {
                  onOpenDetails && onOpenDetails(dir);
                  setOnViewDocumentDetails(true);
                }}
              >
                <MoveUpRight className="w-[18px] h-[18px] text-stone-500" />
                <span className="font-medium">Details</span>
              </ItemMenu>
              <ItemMenu
                className="gap-3"
                onClick={() => onPreview && onPreview(dir)}
              >
                <Eye className="w-[18px] h-[18px] text-stone-500" />
                <span className="font-medium">Preview</span>
              </ItemMenu>
              <ItemMenu
                className="gap-3"
                onClick={() => onDownload && onDownload(dir)}
              >
                <Download className="w-[18px] h-[18px] text-stone-500" />
                <span className="font-medium">Download</span>
              </ItemMenu>
              <ItemMenu
                className="gap-3"
                onClick={() => onSendApproval && onSendApproval(dir)}
              >
                <Bell className="w-[18px] h-[18px] text-stone-500" />
                <span className="font-medium">Send Approval Notification</span>
              </ItemMenu>
            </>
          )}
        </MoreOption>
      </TD>
    </tr>
  );
};

export default memo(ColumnsBody);

const Directory = ({ dir }: { dir: any }) => {
  const router = useRouter();
  console.log({ eqp: dir })
  const onClick = () => {
    const query: any = { ...router.query };
    query.parent_id = dir.id;

    const dirs: any = jsonDirs();

    if (Array.isArray(dirs)) {
      dirs.push({
        name: dir.name,
        id: dir.id,
      });
    }

    if (Array.isArray(dirs) && dirs.length > 0) {
      query.dirs = JSON.stringify(dirs);
    }

    let searchParams = new URLSearchParams(query);

    router.push("/documents/equipment?" + searchParams.toString());
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
    <button
      className="flex gap-1 items-start hover:underline text-left"
      onClick={onClick}
    >
      <FolderClosed
        className="fill-orange-300 stroke-orange-400 w-[15px]"
        strokeWidth={0.5}
      />
      <span
        title={dir.name}
        className="w-[250px] whitespace-nowrap overflow-hidden text-ellipsis"
      >
        {dir.name}
      </span>
    </button>
  );
};

const File = ({ name, filename, onClick }: { name: any; filename: any, onClick(event: any): void }) => {
  return (
    <div className="flex gap-1 items-start hover:cursor-pointer" onClick={onClick}>
      <FileIcon
        className="fill-red-500 stroke-red-600 w-[15px]"
        strokeWidth={0.5}
      />
      <span
        title={name}
        className="w-[250px] whitespace-nowrap overflow-hidden text-ellipsis"
      >
        {name}
      </span>
    </div>
  );
};
