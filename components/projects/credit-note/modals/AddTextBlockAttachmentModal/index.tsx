import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { Textarea } from "@/components/ui/textarea";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import useSWR, { useSWRConfig } from "swr";
import InputFile from "@/components/ui/input-file";
import ErrorFormMessage from "@/components/app/error-form-message";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import MoreOption from "@/components/MoreOption";
import { useDeleteTextBlockAttachment } from "./useDeleteTextBlockAttachment";

function AddTextBlockAttachmentModal(props: AddTextBlockAttachmentModalProps) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, cntb_id, onUpdated } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useSWRConfig();
  const [files, setFiles] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editItem, setEditItem] = useState<any | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const { mutateDelete, Dialog: DeleteDialog } = useDeleteTextBlockAttachment({
    cntb_id,
    onDelete: (cntb_attachment_id: string) => {
      const updatedList = items.filter(
        (item) => item.cntb_attachment_id !== cntb_attachment_id
      );
      setItems(updatedList);

      // reset the form
      reset();
      setFiles(null);

      // Clear edit mode and editItem after successful add/edit
      setIsEditMode(false);
      setEditItem(null);

      // remove is submitting if existing
      setIsSubmitting(false);
    },
  });

  const yupSchema = yup.object({
    file_header: yup.string().nullable(),
    file_description: yup.string().nullable(),
    file: yup.string().nullable(),
  });

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      file_header: editItem?.file_header || "",
      file_description: editItem?.file_description || "",
      file: "",
    },
  });

  // Populate file field separately
  useEffect(() => {
    if (editItem) {
      setValue("file", editItem.file);
    }
  }, [editItem, setValue]);

  const onSubmitEditForm = async (data: any) => {
    try {
      setIsSubmitting(true);
      const formData = new FormData();
      let endpoint = `${baseUrl}/api/projects/credits/text_blocks/attachments/${cntb_id}/null`;

      formData.append("file", files ? files[0] : null);
      formData.append("data", JSON.stringify(data));

      if (isEditMode && editItem) {
        // If in edit mode, update the item
        endpoint = `${baseUrl}/api/projects/credits/text_blocks/attachments/${editItem.cntb_id}/${editItem.cntb_attachment_id}`;
      }

      const response = await fetch(endpoint, {
        headers: authHeaders(session?.user?.access_token, true),
        method: "POST",
        body: formData,
      });
      const json = await response.json();

      if (json.success) {
        // reset the form
        reset();
        setFiles(null);

        // Clear edit mode and editItem after successful add/edit
        setIsEditMode(false);
        setEditItem(null);

        mutate([
          `/api/projects/credits/text_blocks/attachments/${cntb_id}`,
          session?.user?.access_token,
        ]);
        setIsSubmitting(false);
      }
    } catch (err: any) {
      setIsSubmitting(false);
    }
  };

  // Define a type for the shape of your form data
  type FormData = {
    cntb_attachment_id: string;
    file_header: string;
    file_description: string;
    file: string;
  };

  const handleEditClick = (row: FormData) => {
    setEditItem(row);
    setIsEditMode(true);

    // Populate form fields with the data from the clicked row
    Object.keys(row).forEach((key) => {
      setValue(key as any, row[key as keyof FormData]);
    });
  };

  const { data, isLoading } = useSWR(
    session?.user?.access_token
      ? [
          `/api/projects/credits/text_blocks/attachments/${cntb_id}`,
          session?.user?.access_token,
        ]
      : null,
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return (
    <Dialog
      open={open}
      onOpenChange={(open) =>
        !isSubmitting && onOpenChange && onOpenChange(open)
      }
    >
      <DialogContent
        forceMount
        className="max-w-[910px] p-0 overflow-auto gap-0"
      >
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-background z-10">
          <DialogTitle>Text Blocks Attachments</DialogTitle>
          <DialogPrimitive.Close
            disabled={isSubmitting}
            className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200"
          >
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form ref={formRef} onSubmit={handleSubmit(onSubmitEditForm)}>
          <div className="grid grid-cols-12 relative px-3">
            <div className="col-span-4 flex flex-col gap-4 px-4">
              <div className="flex flex-col gap-2">
                <label>Attach a file</label>
                <Controller
                  name="file"
                  control={control}
                  render={({ field }) => (
                    <InputFile
                      accept="*"
                      onChange={(files) => setFiles(files)}
                    />
                  )}
                />
                {errors.file && (
                  <ErrorFormMessage message={errors.file?.message} />
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label>File Header</label>
                <div>
                  <Textarea
                    placeholder="Text"
                    className="bg-stone-100 border-0"
                    {...register("file_header")}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label>File Description</label>
                <div>
                  <Textarea
                    placeholder="Text"
                    className="bg-stone-100 border-0"
                    {...register("file_description")}
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className={cn(isSubmitting && "loading")}
              >
                {isEditMode ? "Update" : "Submit"}
              </Button>
            </div>
            <div className="col-span-8 flex flex-col gap-4 px-4">
              <div
                style={{
                  height: "380px",
                  overflowY: "auto",
                  border: "solid 1px #ccc",
                }}
              >
                <table className="w-full rounded-sm overflow-auto p-5">
                  <thead>
                    <tr>
                      <th className="py-2 px-2 text-sm text-stone-600 font-medium bg-stone-300 w-[20%]">
                        Header
                      </th>
                      <th className="py-2 px-2 text-sm text-stone-600 font-medium bg-stone-300 w-[40%]">
                        Description
                      </th>
                      <th className="py-2 px-2 text-sm text-stone-600 font-medium bg-stone-300 w-[20%]">
                        File
                      </th>
                      <th className="py-2 px-2 text-sm text-stone-600 font-medium bg-stone-300 w-[20%]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Array.isArray(data) && data.length === 0 && (
                      <tr>
                        <td colSpan={4}>
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
                        <td className="p-2 pt-4 text-center" colSpan={4}>
                          <div className="flex flex-col gap-2 items-center">
                            <Skeleton className="w-[250px] h-[20px]" />
                            <Skeleton className="w-[100px] h-[20px]" />
                          </div>
                        </td>
                      </tr>
                    )}

                    {data?.map((row: any, key: number) => (
                      <tr key={key} className="group">
                        <TD className="align-top">
                          <span className="text-sm">{row.file_header}</span>
                        </TD>
                        <TD className="align-top">
                          <span className="text-sm">
                            {row.file_description}
                          </span>
                        </TD>
                        <TD className="align-top">
                          <Link
                            href={`https://hotware.blob.core.windows.net/apps/Hotware/documents/textblocks/${row.file}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <span className="text-blue-600 font-medium">
                              {row.file}
                            </span>
                          </Link>
                        </TD>
                        <TD className="align-top text-right pe-4">
                          <MoreOption>
                            <div
                              onClick={() => handleEditClick(row)}
                              className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                            >
                              <Pencil className="w-[18px] h-[18px] text-blue-500" />
                              <span className="text-sm font-medium">Edit</span>
                            </div>
                            <div
                              onClick={() =>
                                mutateDelete(row.cntb_attachment_id)
                              }
                              className="flex items-center p-2 px-3 cursor-pointer gap-3 hover:bg-stone-100 outline-none"
                            >
                              <Trash2 className="w-[18px] h-[18px] text-red-500" />
                              <span className="text-sm font-medium">
                                Delete
                              </span>
                            </div>
                          </MoreOption>
                        </TD>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="p-3"></div>
        </form>
      </DialogContent>
      <DeleteDialog />
    </Dialog>
  );
}

export const TH = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <td
    className={cn(
      "py-3 px-2 text-sm bg-stone-200 text-stone-600 font-medium",
      className
    )}
  >
    {children}
  </td>
);
export const TD = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <td
    className={cn(
      "py-3 px-2 border-b border-b-stone-100 group-last:border-0",
      className
    )}
  >
    {children}
  </td>
);

export default memo(AddTextBlockAttachmentModal);

type AddTextBlockAttachmentModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  cntb_id: any;
  onUpdated?: (id?: any, newVal?: any) => void;
};
