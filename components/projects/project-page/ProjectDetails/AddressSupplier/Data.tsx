import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { AccessTokenContext } from "@/context/access-token-context";
import { ProjectDetailsContext } from "@/pages/projects/[project_id]";
import { fetchApi } from "@/utils/api.config";
import {
  FileMinus,
  MoreVertical,
  Paperclip,
  Pencil,
  Plus,
  Trash,
} from "lucide-react";
import Link from "next/link";
import { useContext } from "react";
import useSWR from "swr";

const Data = ({ headerSize }: { headerSize?: any }) => {
  const access_token = useContext(AccessTokenContext);
  const payload: any = {};
  const queryString = new URLSearchParams(payload).toString();
  const project = useContext(ProjectDetailsContext);

  const { data, isLoading, error } = useSWR(
    [
      `/api/projects/${project.data?._project_id}/supplier?${queryString}`,
      access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return (
    <ScrollArea
      className="bg-background w-1/2 rounded-xl"
      viewPortStyle={{
        height: `calc(100vh - (var(--header-height) + ${
          headerSize?.height + 40
        }px))`,
      }}
    >
      <div className="flex justify-between p-3 sticky top-0 z-10 backdrop-blur-sm">
        <p className="font-medium text-lg">Suppliers </p>
        <Button className="flex gap-2 items-center">
          <Plus className="w-[18px]" /> Add New
        </Button>
      </div>

      <div className="p-3 flex flex-col gap-3">
        {isLoading && (
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
            />
          ))}
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
}: {
  label?: any;
  cms_name?: any;
  additional_text?: any;
  _cms_id?: any;
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
            <ItemMenu className="flex gap-3 items-center">
              <Paperclip className="w-[18px]" />
              <span className="font-medium">View Attachment</span>
            </ItemMenu>
            <ItemMenu className="flex gap-3 items-center">
              <FileMinus className="w-[18px]" />
              <span className="font-medium">Remove Attachment</span>
            </ItemMenu>
            <ItemMenu className="flex gap-3 items-center">
              <Pencil className="w-[18px]" />
              <span className="font-medium">Edit</span>
            </ItemMenu>
            <ItemMenu className="flex gap-3 items-center">
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
