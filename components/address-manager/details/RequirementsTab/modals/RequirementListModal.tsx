import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { memo, useContext, useState } from "react";
import { CmsDetailsContext } from "@/pages/address-manager/[cms_id]";
import { AccessTokenContext } from "@/context/access-token-context";
import { TD, TH } from "@/components/items";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/pagination";

function RequirementListModal(props: RequirementListModal) {
  const { open, onOpenChange, document_level_id, document_level_name } = props;
  const cms: any = useContext(CmsDetailsContext);
  const access_token = useContext(AccessTokenContext);
  const [page, setPage] = useState(1);

  const queryString = new URLSearchParams({ page: String(page) }).toString();

  const { data, isLoading, error, mutate } = useSWR(
    [
      document_level_id &&
        `/api/requirementlevel/categories/${document_level_id}?${queryString}`,
      access_token,
    ],
    fetchApi
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[600px] p-0 overflow-auto gap-0 ">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>{document_level_name}</DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>

        <table className="w-full">
          <thead>
            <tr>
              <TH className="ps-4">Document Type</TH>
              <TH>Document Name</TH>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data?.list) && data.list.length === 0 && (
              <tr>
                <td colSpan={2}>
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
                <td className="p-2 pt-4 text-center" colSpan={2}>
                  <div className="flex flex-col gap-2 items-center">
                    <Skeleton className="w-[250px] h-[20px]" />
                    <Skeleton className="w-[100px] h-[20px]" />
                  </div>
                </td>
              </tr>
            )}

            {Array.isArray(data?.list) &&
              data.list.map((item: any, key: number) => (
                <tr key={key} className="group hover:bg-stone-100">
                  <TD className="ps-4 font-medium">
                    {item.document_category_name}
                  </TD>
                  <TD className="group-last:border-b-0 font-medium">
                    {item.document_type_name}
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
      </DialogContent>
    </Dialog>
  );
}

export default memo(RequirementListModal);

type RequirementListModal = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
  document_level_id?: any;
  document_level_name?: any;
};
