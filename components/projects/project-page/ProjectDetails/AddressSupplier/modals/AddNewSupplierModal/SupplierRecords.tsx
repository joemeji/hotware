import { TD, TH } from "@/components/items";
import { toast } from "@/components/ui/use-toast";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { memo } from "react";
import useSWR from "swr";

function SupplierRecords(props: SupplierRecordProps) {
  const { data: session }: any = useSession();
  const { supplierID, projectId, onOpenChange, onSuccess } = props;

  const { data, isLoading, error, mutate } = useSWR(
    [
      supplierID ? `/api/projects/supplier/get_supplier_records/${supplierID}` : null,
      session.user.access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  async function onSave(supplier: any) {
    const payload = {
      project_id: projectId,
      supplier_id: supplier.project_supplier_id
    }
    const res = await fetch(`${baseUrl}/api/projects/supplier/add_related_supplier`, {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: authHeaders(session.user.access_token)
    });

    const json = await res.json();
    if (json && json.success) {
      toast({
        title: json.message,
        variant: "success",
        duration: 4000,
      });
      setTimeout(() => {
        onOpenChange && onOpenChange(false);
        onSuccess && onSuccess(true)
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

  console.log({ data: data })
  return (
    <>
      {
        data &&
        data.map((row: any, key: number) => (
          <tr key={key} className="hover:bg-stone-100">
            <TD className="align-top ps-4">
              <p className="font-medium">{row.project_name}</p> / <span className="text-stone-300">{row.project_number}</span>
            </TD>
            <TD className="align-top ps-4">
              <td>{row.cms_name}</td>
            </TD>
            <TD className="align-top ps-4">
              <td>{row.project_supplier_text}</td>
            </TD>
            <TD className="align-top ps-4">
              <div className="w-fit p-0.5 rounded-full bg-stone-100 hover:bg-stone-200 hover:cursor-pointer">
                <Plus color="green" onClick={() => onSave(row)} />
              </div>
            </TD>
          </tr>
        ))
      }
    </>
  )
}

export default memo(SupplierRecords);

type SupplierRecordProps = {
  supplierID?: any,
  projectId?: any,
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (success: boolean) => void
};