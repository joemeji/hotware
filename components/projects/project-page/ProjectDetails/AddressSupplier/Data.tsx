import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AccessTokenContext } from "@/context/access-token-context";
import { ProjectDetailsContext } from "@/pages/projects/[project_id]";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import {
  FileMinus,
  MoreVertical,
  Paperclip,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useContext, useState } from "react";
import useSWR, { mutate } from "swr";
import AddNewSupplierModal from "./modals/AddNewSupplierModal/AddNewSupplierModal";
import { supplier_base } from "@/lib/azureUrls";
import { RemoveAttachment } from "./modals/RemoveAttachmentDialog/remove";
import { toast } from "@/components/ui/use-toast";
import EditSupplierModal from "./modals/EditSupplierModal";
import { DeleteSupplier } from "./modals/DeleteSupplierModal";
import Image from "next/image";

const Data = ({ headerSize }: { headerSize?: any }) => {
  const access_token = useContext(AccessTokenContext);
  const payload: any = {};
  const queryString = new URLSearchParams(payload).toString();
  const project = useContext(ProjectDetailsContext);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [removeAttachmentFile, setRemoveAttachmentFile] = useState(false);
  const [openAddSupplierModal, setOpenAddSupplierModal] = useState(false);
  const [editSupplierMmodal, setEditSupplierModal] = useState(false);
  const [deleteSupplierMmodal, setDeleteSupplierModal] = useState(false);

  const { data, isLoading, error, mutate } = useSWR(
    [
      project.data?._project_id &&
        `/api/projects/${project.data?._project_id}/supplier?${queryString}`,
      access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  function supplierEvents(evt: any, supplier: any) {
    console.log({ event: evt, supplierId: supplier });
    setSelectedSupplier(supplier);
    if (evt == "view-attach") {
      viewAttachment(supplier);
    } else if (evt == "remove-attach") {
      setRemoveAttachmentFile(true);
    } else if (evt == "edit") {
      setEditSupplierModal(true);
    } else if (evt == "delete") {
      setDeleteSupplierModal(true);
    }
  }

  function viewAttachment(supplier: any) {
    if (supplier.project_supplier_attachment != null) {
      const a = document.createElement("a");
      a.target = "_blank";
      a.href = `${supplier_base}/${supplier.project_supplier_attachment}`;
      a.click();
    } else {
      toast({
        title: "File doesn't exist.",
        variant: "destructive",
        duration: 4000,
      });
    }
  }

  return (
    <ScrollArea
      className="bg-background w-1/2 rounded-xl shadow"
      viewPortStyle={{
        height: `calc(100vh - (var(--header-height) + ${
          headerSize?.height + 40
        }px))`,
      }}
    >
      {openAddSupplierModal && (
        <AddNewSupplierModal
          open={openAddSupplierModal}
          onOpenChange={(open: any) => setOpenAddSupplierModal(open)}
          project={project.data}
          onSuccess={(success: any) => (success ? mutate(data) : null)}
        />
      )}
      {removeAttachmentFile && (
        <RemoveAttachment
          open={removeAttachmentFile}
          onOpenChange={(open: any) => setRemoveAttachmentFile(open)}
          supplier={selectedSupplier}
          onSuccess={(success: any) => (success ? mutate(data) : null)}
        />
      )}
      {editSupplierMmodal && (
        <EditSupplierModal
          open={editSupplierMmodal}
          onOpenChange={(open: any) => setEditSupplierModal(open)}
          supplier={selectedSupplier}
          onSuccess={(success: any) => (success ? mutate(data) : null)}
        />
      )}
      {deleteSupplierMmodal && (
        <DeleteSupplier
          open={deleteSupplierMmodal}
          onOpenChange={(open: any) => setDeleteSupplierModal(open)}
          supplier={selectedSupplier}
          onSuccess={(success: any) => (success ? mutate(data) : null)}
        />
      )}
      <div className="flex justify-between p-3 sticky top-0 z-10 backdrop-blur-sm">
        <p className="font-medium text-lg">Suppliers </p>
        <Button
          className="flex gap-2 items-center py-1.5"
          onClick={() => setOpenAddSupplierModal(true)}
        >
          <Plus className="w-[18px]" /> Add New
        </Button>
      </div>

      <div className="p-3 flex flex-col gap-3">
        {(isLoading || project.isLoading) && (
          <div className="flex flex-col gap-2">
            <Skeleton className="w-[300px] h-[15px]" />
            <Skeleton className="w-[150px] h-[15px]" />
          </div>
        )}

        {Array.isArray(data) &&
          data.map((item: any, key: number) => (
            <SupplierData
              key={key}
              label={item.project_supplier_text}
              cms_name={item.cms_name}
              additional_text={item.project_supplier_additionals}
              _cms_id={item._cms_id}
              onClickItem={(event: any) => supplierEvents(event, item)}
            />
          ))}

        {Array.isArray(data) && data.length === 0 && (
          <div className="flex justify-center">
            <Image
              src="/images/No data-rafiki.svg"
              width={400}
              height={400}
              alt="No Data to Shown"
            />
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default Data;

const SupplierData = ({
  label,
  cms_name,
  additional_text,
  _cms_id,
  onClickItem,
}: {
  label?: any;
  cms_name?: any;
  additional_text?: any;
  _cms_id?: any;
  onClickItem?: (event: any) => void;
}) => {
  return (
    <div className="rounded-xl border p-3">
      <div className="flex justify-between items-center">
        <p className="text-lg font-medium">{label}</p>
        <div className="flex items-center gap-1">
          <Link href={`/address-manager/${_cms_id}`} target="_blank">
            <Button variant={"secondary"} className="py-1">
              View Supplier
            </Button>
          </Link>
          <MoreOption
            menuTriggerChildren={
              <Button variant={"ghost"} className="px-2 py-1">
                <MoreVertical className="w-[18px]" />
              </Button>
            }
          >
            <ItemMenu
              className="flex gap-3 items-center"
              onClick={() => onClickItem && onClickItem("view-attach")}
            >
              <Paperclip className="w-[18px]" />
              <span className="font-medium">View Attachment</span>
            </ItemMenu>
            <ItemMenu
              className="flex gap-3 items-center"
              onClick={() => onClickItem && onClickItem("remove-attach")}
            >
              <FileMinus className="w-[18px]" />
              <span className="font-medium">Remove Attachment</span>
            </ItemMenu>
            <ItemMenu
              className="flex gap-3 items-center"
              onClick={() => onClickItem && onClickItem("edit")}
            >
              <Pencil className="w-[18px]" />
              <span className="font-medium">Edit</span>
            </ItemMenu>
            <ItemMenu
              className="flex gap-3 items-center"
              onClick={() => onClickItem && onClickItem("delete")}
            >
              <Trash className="w-[18px]" />
              <span className="font-medium">Delete</span>
            </ItemMenu>
          </MoreOption>
        </div>
      </div>

      <Separator className="my-3" />

      <div className="flex flex-col gap-2">
        <p className="text-base font-medium">{cms_name}</p>
        {additional_text && (
          <div className="p-2 bg-stone-100 rounded-xl">{additional_text}</div>
        )}
      </div>
    </div>
  );
};
