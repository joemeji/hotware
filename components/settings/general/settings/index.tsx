import UploadModal from "@/components/address-manager/details/DocumentTab/UploadTab/UploadModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import InputFile from "@/components/ui/input-file";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { AccessTokenContext } from "@/context/access-token-context";
import { authHeaders, baseUrl, fetcher } from "@/utils/api.config";
import { yupResolver } from "@hookform/resolvers/yup";
import { useContext, useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";
import * as yup from "yup";

export const SettingsApp = () => {
  const access_token: any = useContext(AccessTokenContext);

  const { data, isLoading } = useSWR("/api/general-settings/info", fetcher);

  const submit = async (data: any) => {
    try {
      const formData = new FormData();

      for (let [key, value] of Object.entries(data)) {
        formData.append(key, value as string);
      }

      const url = `${baseUrl}/api/update-settings`;

      const res = await fetch(url, {
        headers: authHeaders(access_token, true),
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: "Successfully Added",
          variant: "success",
          duration: 4000,
        });
      } else {
        toast({
          title: json?.error,
          variant: "error",
          duration: 4000,
        });
      }
    } catch {}
  };

  const yupSchema = yup.object({
    app_name: yup.string().required("Title is required"),
    app_details: yup.string().optional(),
    logo_icon: yup.mixed().optional(),
    logo_name: yup.mixed().optional(),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  useEffect(() => {
    if (data) {
      setValue(
        "app_details",
        data?.find((j: any) => j.app_settings_name == "APP_DETAILS")
          ?.app_settings_value
      );
      setValue(
        "app_name",
        data?.find((j: any) => j.app_settings_name == "APP_NAME")
          ?.app_settings_value
      );
    }
  }, [data, setValue]);

  return (
    <div className="">
      <div className="p-[20px] w-full max-w-[1600px] mx-auto xl:min-h-screen">
        <div className="rounded-xl mt-4 shadow-sm flex flex-col min-h-[600px]">
          <h2 className="text-xl">App Settings</h2>
          <form onSubmit={handleSubmit(submit)} encType="multipart/form-data">
            <div className="p-10 grid grid-cols-4 gap-3">
              <div className="col-span-3 flex flex-col gap-3">
                <div className="grid grid-cols-8">
                  <label className="col-span-1">Logo icon</label>
                  <div className="col-span-7">
                    <div className="flex gap-2 items-center">
                      <label>Current file:</label>
                      <p className="font-bold text-xl">
                        {
                          data?.find(
                            (j: any) => j.app_settings_name == "LOGO_ICON"
                          )?.app_settings_value
                        }
                      </p>
                    </div>
                    <InputFile
                      {...register("logo_icon")}
                      onChange={(files: any) => {
                        setValue("logo_icon", files[0]);
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-8">
                  <label className="col-span-1">Logo Name</label>
                  <div className="col-span-7">
                    <div className="flex gap-2 items-center">
                      <label>Current file:</label>
                      <p className="font-bold text-xl">
                        {
                          data?.find(
                            (j: any) => j.app_settings_name == "LOGO_NAME"
                          )?.app_settings_value
                        }
                      </p>
                    </div>
                    <InputFile
                      {...register("logo_name")}
                      onChange={(files: any) => {
                        setValue("logo_name", files[0]);
                      }}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-8">
                  <label className="col-span-1">App Name</label>
                  <div className="col-span-7">
                    <Input {...register("app_name")} />
                  </div>
                </div>
                <div className="grid grid-cols-8">
                  <label className="col-span-1">App Details</label>
                  <div className="col-span-7 bg-white">
                    <Textarea {...register("app_details")} />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button> Save Changes</Button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
