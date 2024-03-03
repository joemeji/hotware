import { TD, TH, ItemMenu } from "@/components/items";
import { authHeaders, baseUrl, fetcher } from "@/utils/api.config";
import { memo, useContext, useState } from "react";
import useSWR from "swr";
import MoreOption from "@/components/MoreOption";
import { Check, Pencil, Plus, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AddNewLocationModal from "./modals/AddNewLocationModal";
import { CmsDetailsContext } from "@/pages/address-manager/[cms_id]";
import { AccessTokenContext } from "@/context/access-token-context";
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
import { Skeleton } from "@/components/ui/skeleton";
import SearchInput from "@/components/app/search-input";

const Location = () => {
  const [openCreateLocation, setOpenCreateLocation] = useState(false);
  const cms: any = useContext(CmsDetailsContext);
  const [selectedAdd, setSelectedAdd] = useState<any>(null);
  const access_token = useContext(AccessTokenContext);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<any>(false);
  const [loadingDeleteBtn, setLoadingDeleteBtn] = useState(false);
  const [search, setSearch] = useState<any>(null);

  let { data, isLoading, error, mutate } = useSWR(
    `/api/cms/${cms?._cms_id}/address?search=${search}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const address = (row: any) => {
    let rows = [
      row.cms_address_building || null,
      row.cms_address_street || null,
      row.cms_address_city || null,
      row.cms_address_zip || null,
      row.country_name || null,
    ];
    return rows.filter((loc: any) => loc !== null).join(", ");
  };

  const onEdit = (address: any) => {
    setSelectedAdd(address);
    setOpenCreateLocation(true);
  };

  const onDelete = (address: any) => {
    setSelectedAdd(address);
    setOpenDeleteAlert(true);
  };

  const onSetCorrespondence = async (address: any) => {
    try {
      const res = await fetch(
        `${baseUrl}/api/cms/address/${cms?._cms_id}/update`,
        {
          headers: authHeaders(access_token),
          method: "post",
          body: JSON.stringify({
            is_default: 1,
            cms_address_id: address.cms_address_id,
          }),
        }
      );
      const json = await res.json();
      if (json.success) {
        mutate(data);
      }
    } catch (err: any) {
      console.log(err);
    }
  };

  const onForceDelete = async () => {
    try {
      setLoadingDeleteBtn(true);
      const res = await fetch(
        `${baseUrl}/api/cms/address/${cms?._cms_id}/delete`,
        {
          headers: authHeaders(access_token),
          method: "post",
          body: JSON.stringify({
            cms_address_id: selectedAdd?.cms_address_id,
          }),
        }
      );
      const json = await res.json();
      if (json.success) {
        mutate(data);
        setOpenDeleteAlert(false);
        setLoadingDeleteBtn(false);
      }
    } catch (err: any) {
      console.log(err);
      setLoadingDeleteBtn(false);
    }
  };

  return (
    <>
      <AddNewLocationModal
        open={openCreateLocation}
        onOpenChange={(open: any) => {
          setOpenCreateLocation(open);
          if (!open) setSelectedAdd(null);
        }}
        onSuccess={() => mutate(data)}
        selectedAddress={selectedAdd}
      />

      <AlertDialog
        open={openDeleteAlert}
        onOpenChange={(open: any) => {
          if (!open) setSelectedAdd(null);
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

      <div className="flex flex-col gap-3 border rounded-xl w-full">
        <div className="flex justify-between pt-3 px-3">
          <span className="text-base font-medium">Locations</span>
          <div className="flex items-center gap-2">
            <SearchInput
              onChange={(e) => setSearch(e.target.value)}
              value={search}
              delay={500}
            />
            <Button
              className="p-2 rounded-xl"
              onClick={() => setOpenCreateLocation(true)}
            >
              <Plus />
            </Button>
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr>
              <TH className="ps-4">#</TH>
              <TH>Address</TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="p-2 pt-4 text-center" colSpan={3}>
                  <div className="flex flex-col gap-2 items-center">
                    <Skeleton className="w-[250px] h-[20px]" />
                    <Skeleton className="w-[100px] h-[20px]" />
                  </div>
                </td>
              </tr>
            )}
            {Array.isArray(data?.address) &&
              data.address.map((row: any, key: number) => (
                <tr key={key} className="group hover:bg-stone-100">
                  <TD className="group-last:border-b-0 font-medium ps-4 align-top">
                    {key + 1}
                  </TD>
                  <TD className="group-last:border-b-0">
                    <div className="flex gap-2 items-start">
                      {address(row)}
                      {row.is_default == 1 && (
                        <div
                          className={cn(
                            "bg-green-600 text-white w-fit px-2 py-[1px] text-[11px] rounded-full",
                            "flex items-center"
                          )}
                        >
                          Correnspondence
                        </div>
                      )}
                    </div>
                  </TD>
                  <TD className="group-last:border-b-0 text-right align-top">
                    <MoreOption>
                      <ItemMenu className="gap-3" onClick={() => onEdit(row)}>
                        <Pencil className="w-[18px] h-[18px] text-blue-500" />
                        <span className="font-medium">Edit</span>
                      </ItemMenu>
                      {row.is_default == 0 && (
                        <ItemMenu
                          className="gap-3"
                          onClick={() => onSetCorrespondence(row)}
                        >
                          <Check
                            className="w-[18px] h-[18px] text-green-500"
                            strokeWidth={3}
                          />
                          <span className="font-medium">
                            Set as Correspondence
                          </span>
                        </ItemMenu>
                      )}
                      <ItemMenu className="gap-3" onClick={() => onDelete(row)}>
                        <Trash className="w-[18px] h-[18px] text-red-500" />
                        <span className="font-medium">Delete</span>
                      </ItemMenu>
                    </MoreOption>
                  </TD>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default memo(Location);
