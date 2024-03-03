import { ItemMenu, TD, TH } from "@/components/items";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CmsDetailsContext } from "@/pages/address-manager/[cms_id]";
import { authHeaders, baseUrl, fetcher } from "@/utils/api.config";
import { Pencil, Plus, Trash } from "lucide-react";
import { memo, useContext, useState } from "react";
import useSWR from "swr";
import MoreOption from "@/components/MoreOption";
import { Check } from "lucide-react";
import Pagination from "@/components/pagination";
import AddVatModal from "./modals/AddVatModal";
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
import { AccessTokenContext } from "@/context/access-token-context";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import SearchInput from "@/components/app/search-input";

export const listUrl = (_cms_id: any) => `/api/cms/${_cms_id}/vat`;

const VatDetailsTab = () => {
  const cms: any = useContext(CmsDetailsContext);
  const [openVatModal, setOpenVatModal] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedVat, setSelectedVat] = useState<any>(null);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<any>(false);
  const [loadingDeleteBtn, setLoadingDeleteBtn] = useState(false);
  const access_token = useContext(AccessTokenContext);
  const [search, setSearch] = useState<any>(null);

  const queryString = new URLSearchParams({
    page: String(page),
    search: search,
  }).toString();

  let { data, isLoading, error, mutate } = useSWR(
    `${listUrl(cms?._cms_id)}?${queryString}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  // TODO apply loading state on the list

  const onEdit = (vat: any) => {
    setSelectedVat(vat);
    setOpenVatModal(true);
  };

  const onDelete = (vat: any) => {
    setSelectedVat(vat);
    setOpenDeleteAlert(true);
  };

  const onForceDelete = async () => {
    try {
      setLoadingDeleteBtn(true);

      const res = await fetch(`${baseUrl}/api/cms/vat/${cms?._cms_id}/delete`, {
        method: "post",
        headers: authHeaders(access_token),
        body: JSON.stringify({ cms_vat_id: selectedVat?.cms_vat_id }),
      });

      const json = await res.json();

      if (json.success) {
        toast({
          title: "VAT successfully deleted.",
          variant: "success",
          duration: 4000,
        });
        mutate(data);
        setOpenDeleteAlert(false);
      }
    } catch (err: any) {
      setLoadingDeleteBtn(false);
      setOpenDeleteAlert(false);
    } finally {
      setLoadingDeleteBtn(false);
    }
  };

  return (
    <>
      <AddVatModal
        open={openVatModal}
        onOpenChange={(open: any) => {
          setOpenVatModal(open);
          if (!open) setSelectedVat(null);
        }}
        onSuccess={() => mutate(data)}
        selectedVat={selectedVat}
      />

      <AlertDialog
        open={openDeleteAlert}
        onOpenChange={(open: any) => {
          setOpenDeleteAlert(open);
          if (!open) setSelectedVat(null);
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

      <div className="flex flex-col gap-3 border rounded-xl">
        <div className="pt-4 px-4">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium">Value Added Tax (VAT)</span>
            <div className="flex items-center gap-2">
              <SearchInput
                onChange={(e) => setSearch(e.target.value)}
                value={search}
                delay={500}
              />
              <Button
                className="p-2 rounded-full"
                onClick={() => setOpenVatModal(true)}
              >
                <Plus />
              </Button>
            </div>
          </div>
        </div>

        <table className="w-full">
          <thead>
            <tr>
              <TH className="ps-4">#</TH>
              <TH>Code</TH>
              <TH>Description</TH>
              <TH></TH>
              <TH className="text-right">Actions</TH>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data?.vats) && data.vats.length === 0 && (
              <tr>
                <td colSpan={5}>
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
                <td className="p-2 pt-4 text-center" colSpan={5}>
                  <div className="flex flex-col gap-2 items-center">
                    <Skeleton className="w-[250px] h-[20px]" />
                    <Skeleton className="w-[100px] h-[20px]" />
                  </div>
                </td>
              </tr>
            )}

            {Array.isArray(data?.vats) &&
              data.vats.map((vat: any, key: number) => (
                <tr key={key} className="group hover:bg-stone-100">
                  <TD className="ps-4 font-medium">{data.offset + key + 1}</TD>
                  <TD className="group-last:border-b-0 font-medium">
                    {vat.cms_vat_code}
                  </TD>
                  <TD className="group-last:border-b-0">
                    {vat.cms_vat_description}
                  </TD>
                  <TD className="group-last:border-b-0">
                    {vat.cms_vat_is_default == 1 && (
                      <div
                        className={cn(
                          "bg-green-600 text-white w-fit px-2 py-[1px] text-[11px] rounded-full",
                          "flex items-center"
                        )}
                      >
                        Default
                      </div>
                    )}
                  </TD>
                  <TD className="text-right group-last:border-b-0">
                    <MoreOption>
                      <ItemMenu className="gap-3" onClick={() => onEdit(vat)}>
                        <Pencil className="w-[18px] h-[18px] text-blue-500" />
                        <span className="font-medium">Edit</span>
                      </ItemMenu>
                      {vat.cms_vat_is_default == 0 && (
                        <ItemMenu className="gap-3">
                          <Check
                            className="w-[18px] h-[18px] text-green-500"
                            strokeWidth={3}
                          />
                          <span className="font-medium">Set as Default</span>
                        </ItemMenu>
                      )}
                      <ItemMenu className="gap-3" onClick={() => onDelete(vat)}>
                        <Trash className="w-[18px] h-[18px] text-red-500" />
                        <span className="font-medium">Delete</span>
                      </ItemMenu>
                    </MoreOption>
                  </TD>
                </tr>
              ))}
          </tbody>
        </table>
        {data?.pager && (
          <div className="mt-auto border-t border-t-stone-100">
            <Pagination
              pager={data.pager}
              onPaginate={(page: any) => setPage(page)}
              currPage={page}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default memo(VatDetailsTab);
