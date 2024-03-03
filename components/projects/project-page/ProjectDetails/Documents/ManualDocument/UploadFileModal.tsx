import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import InputFile from "@/components/ui/input-file";
import { toast } from "@/components/ui/use-toast";
import { AccessTokenContext } from "@/context/access-token-context";
import { cn } from "@/lib/utils";
import { authHeaders, baseUrl } from "@/utils/api.config";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { useRouter } from "next/router";
import { useContext, useState } from "react";

const UploadFileModal = ({
  open,
  onOpenChange,
  onSuccess,
}: UploadFileModal) => {
  const [title, setTitle] = useState<any>(null);
  const [file, setFile] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const access_token = useContext(AccessTokenContext);

  const onSubmit = async () => {
    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("project_documents_upload_files", file);
      formData.append("upload_document_title", title);

      const res = await fetch(
        `${baseUrl}/api/projects/${router.query.project_id}/document/upload`,
        {
          method: "POST",
          headers: authHeaders(access_token, true),
          body: formData,
        }
      );
      const json = await res.json();
      if (json.success) {
        onSuccess && onSuccess();
        onOpenChange && onOpenChange(false);
        toast({
          title: `Successfully uploaded.`,
          variant: "success",
          duration: 2000,
        });
        setSubmitting(false);
        setTitle(null);
        setFile(null);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => onOpenChange && onOpenChange(open)}
    >
      <DialogContent
        forceMount
        className="max-w-[500px] p-0 overflow-auto gap-0"
      >
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
          <DialogTitle>Upload File</DialogTitle>
          <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <div className="flex flex-col gap-5 px-4 pb-5">
          <div className="flex flex-col gap-1">
            <label>Title</label>
            <Input
              placeholder="Title"
              className="bg-stone-100 border-transparent"
              value={title || ""}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label>Document</label>
            <InputFile onChange={(file) => setFile(file[0])} />
          </div>
          <Button
            className={cn(submitting && "loading")}
            disabled={!title || !file || submitting}
            onClick={onSubmit}
          >
            Submit
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

type UploadFileModal = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
};

export default UploadFileModal;
