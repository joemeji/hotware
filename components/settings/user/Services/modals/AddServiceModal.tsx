import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Pencil, Trash, X } from "lucide-react";
import React, { useContext, useState } from "react";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useSWR, { mutate } from "swr";
import { toast } from "@/components/ui/use-toast";
import { TD, TH } from "@/components/items";
import { AccessTokenContext } from "@/context/access-token-context";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import LoadingMore from "@/components/LoadingMore";

const yupObject: any = {
  user_service_name: yup.string().required("This field is required."),
};

export const AddNewServiceModal = (props: AddNewServiceModalProps) => {
  const access_token = useContext(AccessTokenContext);
  const { open, onOpenChange } = props;
  const yupSchema = yup.object(yupObject);
  const [loading, setLoading] = useState(false);
  const [onUpdate, setOnUpdate] = useState(false);
  const [selectedService, setSelectedService] = useState<any>([]);

  const { data, isLoading, mutate } = useSWR(
    access_token ? ["/api/users/get_services", access_token] : null,
    fetchApi,
    { revalidateOnFocus: false }
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control,
    reset,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const handleFormSubmit = async (data: any) => {
    try {
      setLoading(true);
      const res = await fetch(`${baseUrl}/api/users/service/add`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: authHeaders(access_token),
      });

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: json.message,
          variant: "success",
          duration: 4000,
        });
        mutate(data);
      } else {
        toast({
          title: json.message,
          variant: "destructive",
          duration: 4000,
        });
      }
      setLoading(false);
    } catch {}
    reset();
  };

  const updateService = async (data: any) => {
    try {
      setLoading(true);
      const res = await fetch(
        `${baseUrl}/api/users/service/update/${
          selectedService && selectedService.user_service_id
        }`,
        {
          method: "POST",
          body: JSON.stringify(data),
          headers: authHeaders(access_token),
        }
      );

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: json.message,
          variant: "success",
          duration: 4000,
        });
        mutate(data);
      } else {
        toast({
          title: json.message,
          variant: "destructive",
          duration: 4000,
        });
      }
      setLoading(false);
    } catch {}
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[550px] p-0 overflow-auto gap-0 ">
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>{onUpdate ? "Update" : "Add New"} Service</DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <div className="flex flex-col p-2">
          <form
            action=""
            method="POST"
            onSubmit={handleSubmit(onUpdate ? updateService : handleFormSubmit)}
          >
            <div className="flex gap-3">
              <Input
                className="bg-stone-100 border-transparent"
                placeholder="Service Name"
                error={errors && (errors.user_service_name ? true : false)}
                {...register("user_service_name")}
              />
              {errors.user_service_name && (
                <span className="text-red-500 text-sm">
                  <>{errors.user_service_name?.message}</>
                </span>
              )}
              <Button
                type="submit"
                className={cn("w-[20%] bg-stone-600", loading && "loading")}
              >
                {onUpdate ? "Update" : "Save"}
              </Button>
              {onUpdate && (
                <Button
                  className={cn("w-[20%] bg-red-600")}
                  onClick={() => {
                    setOnUpdate(false);
                    setSelectedService([]);
                    setValue("user_service_name", "");
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
            <div className="w-full flex items-center justify-end p-3"></div>
          </form>
          {isLoading ? (
            <div className="flex justify-center items-center flex-col">
              <LoadingMore />
            </div>
          ) : (
            <table className="w-full rounded-sm overflow-hidden p-5 table-auto">
              <ScrollArea viewPortClassName="flex flex-col max-h-[50vh]">
                <thead className="sticky top-0">
                  <tr>
                    <TH className="w-[90%]">Name</TH>
                    <TH className="w-[10%]">Action</TH>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.length > 0 &&
                    data.map((service: any, i: number) => {
                      return (
                        <tr key={i}>
                          <TD>{service.user_service_name}</TD>
                          <TD>
                            <Button
                              className="bg-orange-500 hover:bg-orange-400"
                              onClick={() => {
                                setOnUpdate(true);
                                setValue(
                                  "user_service_name",
                                  service.user_service_name
                                );
                                setSelectedService(service);
                              }}
                            >
                              <Pencil size={18} strokeWidth={1.75} />
                            </Button>
                          </TD>
                        </tr>
                      );
                    })}
                </tbody>
              </ScrollArea>
            </table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

type AddNewServiceModalProps = {
  open?: boolean;
  onOpenChange?: (open?: boolean) => void;
};
