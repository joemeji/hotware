import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ApiDocumentLanguageSelect from "@/components/app/api-document-language-select";
import DocumentCategorySelect from "@/components/app/document-category-select";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReminderDay from "./ReminderDay";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";
import InputFile from "@/components/ui/input-file";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

const yupSchema = yup.object({
  document_name: yup.string().required("Document name is required."),
  document_description: yup.string(),
  document_language_id: yup.string(),
  document_category_id: yup.string(),
  userfile: yup.mixed(),
  document_with_expiry: yup.boolean(),
  document_expiry_date: yup.string(),
  document_notify_employee: yup.boolean(),
  needs_approval: yup.boolean(),
});

function NewDocumentModal(props: NewDocumentModalProps) {
  const { data: session }: any = useSession();
  const router = useRouter();
  const { open, onOpenChange, onSuccess } = props;
  const [headerHeight, setHeaderHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const [reminderExt, setReminderExt] = useState({});
  const [inputDaysValues, setInputDaysValues] = useState<any>({});
  const parent_id = router.query.parent_id;
  const user_id = router.query.user_id;
  const [loading, setLoading] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      document_with_expiry: true,
    },
  });

  const [withSerial, setWithSerial] = useState(
    getValues("document_with_expiry")
  );

  const onValueChangeSwitch = (checked: boolean, item: any, num: number) => {
    const ext = `reminder_${num}_${item.administrative_reminder_initial}_${item.administrative_reminder_id}`;
    const _reminderExt: any = { ...reminderExt };
    _reminderExt[ext] = checked;
    setReminderExt(_reminderExt);
  };

  const onDaysChange = (e: any) => {
    const _inputDaysValues: any = { ...inputDaysValues };
    const { name, value } = e.target;
    if (!value) delete _inputDaysValues[name];
    else _inputDaysValues[name] = value;
    setInputDaysValues(_inputDaysValues);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    const _data = { ...data };
    const formData = new FormData();

    if (!_data.hasOwnProperty("document_notify_employee")) {
      _data.document_notify_employee = false;
    }

    if (_data.document_with_expiry) {
      for (let [key, value] of Object.entries(reminderExt)) {
        _data[key] = value;
      }
      for (let [key, value] of Object.entries(inputDaysValues)) {
        _data[key] = value;
      }
    } else {
      delete _data.document_expiry_date;
    }

    for (let [key, value] of Object.entries(_data)) {
      formData.append(key, value as string);
    }
    // TODO onSubmit

    const res = await fetch(
      `${baseUrl}/api/document/add_employee_document/${parent_id}/${user_id}`,
      {
        method: "POST",
        body: formData,
        headers: authHeaders(session.user.access_token, true),
      }
    );

    const json = await res.json();
    if (json && json.success) {
      toast({
        title: "Document successfully added.",
        variant: "success",
        duration: 4000,
      });
      setTimeout(() => {
        onOpenChange && onOpenChange(false);
        onSuccess && onSuccess(true);
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
    setLoading(false);
    reset();
  };

  const onFileChange = (files: any) => {
    setValue("userfile", files[0]);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) => onOpenChange && onOpenChange(open)}
      >
        <DialogContent
          forceMount
          className="max-w-[700px] p-0 overflow-auto gap-0"
        >
          <DialogHeader>
            <div
              className="py-2 px-3 flex justify-between flex-row items-start sticky top-0 bg-background z-10"
              ref={(el: any) => {
                setHeaderHeight(el?.offsetHeight);
              }}
            >
              <DialogTitle>
                <div className="flex flex-col gap-1">
                  <span>Create Document</span>
                  <span className="text-sm font-normal text-stone-500">
                    Create document inside this current directory
                  </span>
                </div>
              </DialogTitle>
              <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
                <X />
              </DialogPrimitive.Close>
            </div>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ScrollArea
              viewPortStyle={{
                maxHeight: `calc(100vh - ${footerHeight + headerHeight}px)`,
              }}
            >
              <div className="flex flex-col gap-4 p-4">
                <div className="flex gap-3 w-full">
                  <div className="flex flex-col gap-1 w-full">
                    <label>Name</label>
                    <div>
                      <Input
                        placeholder="Name"
                        className="bg-stone-100 border-0"
                        error={errors && (errors.document_name ? true : false)}
                        {...register("document_name")}
                      />
                      {errors.document_name && (
                        <span className="text-red-500 text-sm">
                          <>{errors.document_name?.message}</>
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <label>Description</label>
                    <div>
                      <Input
                        placeholder="Description"
                        className="bg-stone-100 border-0"
                        error={
                          errors && (errors.document_description ? true : false)
                        }
                        {...register("document_description")}
                      />
                      {errors.document_description && (
                        <span className="text-red-500 text-sm">
                          <>{errors.document_description?.message}</>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 w-full">
                  <div className="flex flex-col gap-1 w-full">
                    <label>Language</label>
                    <div>
                      <Controller
                        name="document_language_id"
                        control={control}
                        render={({ field }) => (
                          <ApiDocumentLanguageSelect
                            placeholder="Language"
                            className={"py-2.5"}
                            value={field.value}
                            onChangeValue={(value) => field.onChange(value)}
                            error={errors.document_language_id}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 w-full">
                    <label>Category</label>
                    <div>
                      <Controller
                        name="document_category_id"
                        control={control}
                        render={({ field }) => (
                          <DocumentCategorySelect
                            placeholder="Category"
                            document_type="employee"
                            className={"py-2.5"}
                            value={field.value}
                            onChangeValue={(value) => field.onChange(value)}
                          />
                        )}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label>Upload Document</label>
                  <InputFile onChange={onFileChange} />
                </div>

                <div className="flex gap-3 w-full  items-end">
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex gap-2 items-center">
                      <Controller
                        name="document_with_expiry"
                        control={control}
                        render={({ field }) => (
                          <Checkbox
                            className="w-[18px] h-[18px] rounded-none"
                            onCheckedChange={(checked: any) => {
                              field.onChange(checked);
                              setWithSerial(checked);
                            }}
                            checked={field.value}
                          />
                        )}
                      />
                      <label className="font-medium">With Expiry</label>
                    </div>
                  </div>
                  {withSerial && (
                    <div className="flex flex-col gap-1 w-full">
                      <label>Expiry Date</label>
                      <div>
                        <Input
                          placeholder="Date expired"
                          className="bg-stone-100 border-0"
                          type="date"
                          required={withSerial}
                          error={
                            errors &&
                            (errors.document_expiry_date ? true : false)
                          }
                          {...register("document_expiry_date")}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {withSerial && (
                  <>
                    <div className="flex flex-col gap-1 w-full my-3">
                      <div className="flex gap-2 items-start">
                        <Controller
                          name="needs_approval"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              className="w-[18px] h-[18px] rounded-none"
                              onCheckedChange={(checked: any) =>
                                field.onChange(checked)
                              }
                              checked={field.value}
                            />
                          )}
                        />
                        <div className="flex flex-col">
                          <label className="font-medium">Needs approval</label>
                          <span className="text-stone-500">
                            Send notification automatically.
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2 items-start">
                        <Controller
                          name="document_notify_employee"
                          control={control}
                          render={({ field }) => (
                            <Checkbox
                              className="w-[18px] h-[18px] rounded-none"
                              onCheckedChange={(checked: any) =>
                                field.onChange(checked)
                              }
                              checked={field.value}
                            />
                          )}
                        />
                        <div className="flex flex-col">
                          <label className="font-medium">
                            {"Don't notify Worker?"}
                          </label>
                          <span className="text-stone-500">
                            {"Don't notify the worker if document is expiring"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl border border-stone-200">
                      <p className="font-medium text-base">
                        Set Administrative Reminder
                      </p>
                      <p className="text-stone-500">
                        Set reminders by the number of days before expiry.
                      </p>

                      <div className="flex mt-5 gap-4">
                        <div className="w-1/4">
                          <ReminderDay
                            reminder_no={1}
                            onValueChangeSwitch={(checked, item) =>
                              onValueChangeSwitch(checked, item, 1)
                            }
                            onDayChange={onDaysChange}
                            dayValue={inputDaysValues?.reminder_1_days || 90}
                            switchValues={reminderExt}
                          />
                        </div>
                        <div className="w-1/4">
                          <ReminderDay
                            reminder_no={2}
                            onValueChangeSwitch={(checked, item) =>
                              onValueChangeSwitch(checked, item, 2)
                            }
                            onDayChange={onDaysChange}
                            dayValue={inputDaysValues?.reminder_2_days || 60}
                            switchValues={reminderExt}
                          />
                        </div>
                        <div className="w-1/4">
                          <ReminderDay
                            reminder_no={3}
                            onValueChangeSwitch={(checked, item) =>
                              onValueChangeSwitch(checked, item, 3)
                            }
                            onDayChange={onDaysChange}
                            dayValue={inputDaysValues?.reminder_3_days || 30}
                            switchValues={reminderExt}
                          />
                        </div>
                        <div className="w-1/4">
                          <ReminderDay
                            reminder_no={4}
                            onValueChangeSwitch={(checked, item) =>
                              onValueChangeSwitch(checked, item, 4)
                            }
                            onDayChange={onDaysChange}
                            dayValue={inputDaysValues?.reminder_4_days || 15}
                            switchValues={reminderExt}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <DialogFooter className="sticky bottom-0 backdrop-blur z-10">
                <div
                  className="p-3 w-full flex justify-end"
                  ref={(el: any) => {
                    setFooterHeight(el?.offsetHeight);
                  }}
                >
                  <Button variant={"ghost"} type="button">
                    Cancel
                  </Button>
                  <Button className={cn(loading && "loading")} type="submit">
                    Submit
                  </Button>
                </div>
              </DialogFooter>
            </ScrollArea>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(NewDocumentModal);

type NewDocumentModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: (success: boolean) => void;
};
