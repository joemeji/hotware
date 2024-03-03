import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Button } from "@/components/ui/button";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "@/components/ui/use-toast";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { Check, CheckCircle, Loader2, Plus, X } from "lucide-react";
import useSWR from "swr";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

const yupObject: any = {
  project_scope_work_id: yup.number().required("This field is required."),
};

function ScopeOfWork(props: ScopeOfWorkProps) {
  const { data: session }: any = useSession();
  let isAdded;
  const { open, onOpenChange, project, onSuccess, technician } = props;
  const yupSchema = yup.object(yupObject);

  const [scopes, setScopes] = useState<any>([]);

  const { data, isLoading, error, mutate } = useSWR(
    [
      `/api/projects/${project._project_id}/technician/getTechnicianProjectScope/${technician.project_technician_id}`,
      session.user.access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control,
    getValues,
    reset,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  async function onSave() {
    const payload = {
      scopeID: scopes,
    };
    console.log({ payload: payload });

    const res = await fetch(
      `${baseUrl}/api/projects/${project._project_id}/technician/addProjectScopeTechnician/${technician.project_technician_id}`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: authHeaders(session.user.access_token),
      }
    );
    const json = await res.json();
    if (json && json.success) {
      toast({
        title: json.message,
        variant: "success",
        duration: 4000,
      });
      setTimeout(() => {
        mutate(data);
        onOpenChange && onOpenChange(false);
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
    setScopes([]);
  }

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => onOpenChange && onOpenChange(open)}
      >
        <DialogContent
          forceMount
          className="max-w-[550px] p-0 overflow-auto gap-0"
        >
          <ScrollArea
            className="flex flex-col"
            viewPortClassName="min-h-[400px] max-h-[90vh] rounded-app bg-white"
          >
            <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
              <DialogTitle className="p-2">Select Project Scopes</DialogTitle>
              <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
                <X />
              </DialogPrimitive.Close>
            </DialogHeader>
            <div className="p-5">
              <div className="flex flex-col gap-1 rounded-app bg-white">
                {!isLoading && data?.project_scopes.length == 0 && (
                  <div className="flex justify-center">
                    <Image
                      src="/images/No data-rafiki.svg"
                      width={300}
                      height={300}
                      alt="No Data to Shown"
                    />
                  </div>
                )}

                {isLoading && <Loader2 className="animate-spin mx-auto m-5" />}

                {data &&
                  data.project_scopes.map((scope: any) => (
                    <label
                      className={cn(
                        "flex items-center gap-2 rounded-xl p-3 border hover:cursor-pointer hover:bg-stone-100",
                        scope.isAdded && "bg-stone-300"
                      )}
                      key={scope.project_scope_id}
                    >
                      <Checkbox
                        className="flex self-start mt-1 rounded-none w-[18px] h-[17px]"
                        onCheckedChange={(checked: any) => {
                          console.log({ checked: checked });
                          if (checked) {
                            scope.isAdded = true;
                            setScopes([...scopes, scope.project_scope_id]); // Add scope ID when checked
                          } else {
                            scope.isAdded = false;
                            setScopes(
                              data.project_scopes.filter(
                                (id: number) => id === scope.project_scope_id
                              )
                            );
                          }
                        }}
                        checked={scope.isAdded}
                      />
                      <div
                        className={cn("flex items-center")}
                        dangerouslySetInnerHTML={{
                          __html: scope.project_scope_name,
                        }}
                      />
                    </label>
                  ))}

                <Button
                  className="mt-5 bottom-0 sticky"
                  onClick={() => onSave()}
                >
                  Submit
                </Button>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(ScopeOfWork);

type ScopeOfWorkProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  project?: any;
  onSuccess?: (success: boolean) => void;
  technician?: any;
};
