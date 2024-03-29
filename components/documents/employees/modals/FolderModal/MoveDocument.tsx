import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useContext, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronRight, Folder, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useSWR, { mutate } from "swr";
import { toast } from "@/components/ui/use-toast";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { TD, TH } from "@/components/items";
import { SelectedEmployeeContext } from "@/pages/documents/employees";
import { CheckedFilesContext } from "../../list";
import { ScrollArea } from "@/components/ui/scroll-area";

const yupObject: any = {
  folder_name: yup.string().required("This field is required."),
  folder_description: yup.string().required("This field is required."),
};

function MoveDocument(props: MoveDocumentProps) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, onSuccess } = props;
  const checkedFiles: any = useContext(CheckedFilesContext);
  const router = useRouter();
  const parentID = router.query?.parent_id;
  const userID = router.query?.user_id;
  const [_parentID, setParentID] = useState(parentID);
  const yupSchema = yup.object(yupObject);
  const [directories, setDirectories] = useState<any>([]);

  const { data, isLoading, error, mutate } = useSWR(
    [
      `/api/document/get_dir_by_employee/${_parentID}`,
      session.user.access_token,
    ],
    fetchApi
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  let paramsObj: any = { parent_id: String(parentID), user_id: userID };
  let searchParams = new URLSearchParams(paramsObj);

  async function onSave(e: any) {
    e.preventDefault();
    let folder_id =
      directories.length != 0 ? directories[directories.length - 1].id : 0;
    const res = await fetch(
      `${baseUrl}/api/document/move_selected_documents/${folder_id}`,
      {
        method: "POST",
        body: JSON.stringify(checkedFiles),
        headers: authHeaders(session.user.access_token),
      }
    );

    const json = await res.json();
    if (json && json.success) {
      toast({
        title: "Document successfully moved.",
        variant: "success",
        duration: 4000,
      });
      setTimeout(() => {
        onOpenChange && onOpenChange(false);
        onSuccess && onSuccess();
      }, 300);
    } else {
      toast({
        title: json.message,
        variant: "destructive",
        duration: 4000,
      });
    }
    if (onOpenChange) {
      onOpenChange(false);
    }
  }

  function onClickFolder(folder_id: any, parent_id: any, folder_name: any) {
    const newFolder = [
      ...directories,
      {
        id: folder_id,
        name: folder_name,
      },
    ];
    setDirectories(newFolder);

    setParentID(folder_id);
    mutate(data);
  }

  const handleFolderSelect = (selectedFolderId: any) => {
    const updatedFolders = directories.filter(
      (directory: any) => directory.folder_id <= selectedFolderId
    );
    setDirectories(updatedFolders);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => onOpenChange && onOpenChange(open)}
      >
        <DialogContent
          forceMount
          className="max-w-[700px] p-0 overflow-hidden gap-0"
        >
          <form action="" onSubmit={onSave}>
            <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-background z-10">
              <DialogTitle>
                <span>Create Folder</span>
              </DialogTitle>
              <div className="flex justify-between items-center gap-2">
                <Button type="submit">Move Document</Button>
                <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
                  <X />
                </DialogPrimitive.Close>
              </div>
            </DialogHeader>
            <FolderNavs
              directories={directories && directories}
              onClickItem={(folder: any) => {
                setParentID(folder);
                mutate(data);
                handleFolderSelect(folder);
              }}
            />

            <div className="p-3 flex flex-col gap-2 h-[55vh]">
              <ScrollArea
                className="flex flex-col"
                viewPortClassName="h-[calc(100vh-var(--header-height)-40px)]"
              >
                <table className="w-full">
                  <thead className="sticky z-10 top-0">
                    <tr>
                      <TH className="bg-stone-300">Folder Name</TH>
                    </tr>
                  </thead>

                  <tbody>
                    {data &&
                      data.list.map((folder: any, key: number) => (
                        <tr
                          className="hover:bg-stone-100 hover:cursor-pointer"
                          onClick={() =>
                            onClickFolder(
                              folder.folder_id,
                              folder.parent_id,
                              folder.folder_name
                            )
                          }
                          key={key}
                        >
                          <TD className="flex items-center border">
                            <Folder height={15} color="orange" />
                            {folder.folder_name} (
                            <span className="text-stone-500">
                              {folder.owner}
                            </span>
                            )
                          </TD>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </ScrollArea>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(MoveDocument);

type MoveDocumentProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
};

const FolderNavs = (props: {
  directories: any;
  onClickItem: (folder: any) => void;
}) => {
  const { directories, onClickItem } = props;
  const router = useRouter();
  let folders;
  let dirs: any = [];
  const query: any = router.query;

  if (router.query?.dirs) {
    dirs = JSON.parse(query?.dirs);
  }

  if (dirs.length > 0) {
    folders = [...directories, dirs];
    folders = folders[0];
  } else {
    folders = directories;
  }

  return (
    <div className="flex gap-1 items-center p-3">
      <div className="flex gap-1 items-center">
        <span
          className="flex gap-1 items-center hover:underline cursor-pointer font-medium"
          tabIndex={0}
          onClick={() => onClickItem(0)}
        >
          Basepath
        </span>
        {Array.isArray(folders) && folders.length !== 0 && (
          <ChevronRight className="w-[15px]" />
        )}
      </div>
      {Array.isArray(folders) &&
        folders.map((item: any, key: number) => (
          <div className="flex gap-1" key={key}>
            <span
              className="hover:underline cursor-pointer"
              tabIndex={0}
              onClick={() => onClickItem(item.id)}
            >
              {item.name}
            </span>
            {key !== folders.length - 1 && (
              <ChevronRight className="w-[15px]" />
            )}
          </div>
        ))}
    </div>
  );
};
