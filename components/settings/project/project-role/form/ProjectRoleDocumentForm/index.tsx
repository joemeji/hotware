import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import useSWR from "swr";
import { fetcher } from "@/utils/api.config";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";

interface IProjectRoleDocumentForm {
  id?: string;
  onOpenChange?: (open: boolean) => void;
}
export const ProjectRoleDocumentForm = (props: IProjectRoleDocumentForm) => {
  const { id, onOpenChange } = props;

  const { data: technicianLists, isLoading } = useSWR(
    `/api/project/technician/list`,
    fetcher
  );

  const { data: productRoleDocument, isLoading: prdLoading } = useSWR(
    `/api/project/project-role-document/info?id=${id}`,
    fetcher
  );

  const [ptdlId, setPtdlId] = useState<string[]>([]);

  const handleChange = (id: string) => {
    let value = ptdlId;

    if (value.length === 0) {
      value = [id];
    } else {
      value = [...ptdlId, id];
    }

    if (ptdlId.includes(id)) {
      value = ptdlId.filter((j) => j != id);
    }

    setPtdlId(value);
  };

  const handleSubmit = async () => {
    const data = {
      ptdl_id: ptdlId,
      project_role_id: id,
    };

    try {
      const payload = {
        ...data,
      };

      const url = `/api/project/project-role-document/create`;

      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "Successfully Project Role Document Saved",
          variant: "success",
          duration: 4000,
        });

        setTimeout(() => {
          onOpenChange && onOpenChange(false);
        }, 300);

        if (onOpenChange) {
          onOpenChange(false);
        }
      } else {
        toast({
          title: json?.error,
          variant: "error",
          duration: 4000,
        });
      }
    } catch {}
  };

  useEffect(() => {
    if (productRoleDocument) {
      const currentPtdlId =
        productRoleDocument && productRoleDocument.map((j: any) => j?.ptdl_id);

      setPtdlId(currentPtdlId);
    }
  }, [productRoleDocument]);

  return (
    <>
      <div className='flex flex-col gap-3 border-b py-5 px-10'>
        <label className='font-medium'>List of Documents</label>
        {technicianLists &&
          technicianLists.length > 0 &&
          technicianLists.map((doc: any, i: number) => {
            return (
              <div key={i} className='flex gap-2'>
                <Switch
                  checked={ptdlId.includes(doc?.ptdl_id as string)}
                  onCheckedChange={(checked) => handleChange(doc?.ptdl_id)}
                />
                <h2>{doc?.ptdl_name}</h2>
              </div>
            );
          })}
      </div>
      <div className='px-5'>
        <Button
          className='block w-full mt-5'
          variant={"red"}
          onClick={handleSubmit}
        >
          Save
        </Button>
      </div>
    </>
  );
};
