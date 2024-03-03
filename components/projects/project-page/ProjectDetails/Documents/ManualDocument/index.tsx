import { TD, TH } from "@/components/items";
import { Button } from "@/components/ui/button";
import { AccessTokenContext } from "@/context/access-token-context";
import { cn } from "@/lib/utils";
import { ProjectDetailsContext } from "@/pages/projects/[project_id]";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import {
  Download,
  DownloadCloud,
  Loader2,
  MinusCircle,
  Search,
  Upload,
} from "lucide-react";
import { useRouter } from "next/router";
import { useContext, useState } from "react";
import useSWR from "swr";
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
import { toast } from "@/components/ui/use-toast";
import UploadFileModal from "./UploadFileModal";

const ManualDocument = () => {
  const access_token = useContext(AccessTokenContext);
  const payload: any = {};
  const queryString = new URLSearchParams(payload).toString();
  const project = useContext(ProjectDetailsContext);
  const [openUploadForm, setOpenUploadForm] = useState(false);

  const { data, isLoading, error, mutate } = useSWR(
    [
      project?.data?._project_id &&
        `/api/projects/${project?.data?._project_id}/document/uploads?${queryString}`,
      access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return (
    <>
      <UploadFileModal
        open={openUploadForm}
        onOpenChange={(open) => setOpenUploadForm(open)}
        onSuccess={() => mutate(data)}
      />
      <div className="flex flex-col gap-3">
        <p className="text-base font-medium">Manual Documents</p>
        <div className="flex bg-background rounded-xl flex-col overflow-hidden shadow">
          <div className="p-3 flex justify-between items-center">
            <div>
              {Array.isArray(data) && data.length > 0 && <DownloadAllFiles />}
            </div>
            <div className="flex items-center gap-2">
              <Button
                className="py-1 flex items-center gap-2"
                variant={"outline"}
                onClick={() => setOpenUploadForm(true)}
              >
                <Upload className="w-[18px] text-orange-600" /> Upload File
              </Button>
              <form>
                <div className="bg-stone-100 flex items-center w-[300px] rounded-xl overflow-hidden px-2 h-9 focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-visible:ring-offset-2">
                  <Search className="text-stone-400 w-5 h-5" />
                  <input
                    placeholder="Search"
                    className="border-0 rounded-none outline-none text-sm w-full px-2 bg-stone-100 h-full max-w-[300px]"
                    name="search"
                  />
                </div>
              </form>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr>
                <TH>Document Name</TH>
                <TH>File Name</TH>
                <TH className="text-right pe-4">Action</TH>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(data) &&
                data.map((doc: any, key: number) => (
                  <tr key={key} className="hover:bg-stone-100/20">
                    <TD className="font-medium">{doc.project_document_name}</TD>
                    <TD>{doc.project_document_file}</TD>
                    <TD className="text-right pe-4">
                      <div className="flex gap-1 justify-end">
                        <DownloadButton doc={doc} />
                        <DeleteButton
                          doc={doc}
                          onSuccess={() => mutate(data)}
                        />
                      </div>
                    </TD>
                  </tr>
                ))}

              {(project?.isLoading || isLoading) && (
                <tr>
                  <td className="px-3 py-2" colSpan={3}>
                    <Loader2 className="animate-spin mx-auto m-5" />
                  </td>
                </tr>
              )}

              {Array.isArray(data) && data.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="py-5 opacity-50 text-center font-bold text-lg"
                  >
                    No Records Found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default ManualDocument;

const DownloadAllFiles = () => {
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDownload = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${baseUrl}/api/projects/${router.query.project_id}/document/downloadAll`,
        {
          method: "POST",
          headers: authHeaders(access_token),
        }
      );
      let filename = res.headers.get("Filename");
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.download = filename as string;
      a.href = blobUrl;
      a.click();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={cn("py-1 flex items-center gap-2", loading && "loading")}
      disabled={loading}
      variant={"outline"}
      onClick={onDownload}
    >
      <Download className="w-[18px] text-purple-600" /> Download
    </Button>
  );
};

const DeleteButton = ({
  doc,
  onSuccess,
}: {
  doc: any;
  onSuccess?: () => void;
}) => {
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();
  const [openAlertMessage, setOpenAlertMessage] = useState(false);
  const [alertLoading, setalertLoading] = useState(false);

  const onForceDelete = async () => {
    const formData = new FormData();

    formData.append("project_document_id", doc?.project_document_id);

    try {
      setalertLoading(true);
      const response = await fetch(
        `${baseUrl}/api/projects/${router.query.project_id}/document/delete`,
        {
          headers: authHeaders(access_token, true),
          method: "POST",
          body: formData,
        }
      );
      const json = await response.json();
      if (json.success) {
        toast({
          title: `Deleted successfully.`,
          variant: "success",
          duration: 2000,
        });
        onSuccess && onSuccess();
        setalertLoading(false);
        setOpenAlertMessage(false);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <AlertDialog open={openAlertMessage}>
        <AlertDialogContent className="max-w-[360px]">
          <AlertDialogHeader>
            <AlertDialogTitle>{"Are you sure?"}</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this item?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={alertLoading}
              onClick={() => setOpenAlertMessage(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={alertLoading}
              onClick={onForceDelete}
              className={cn(alertLoading && "loading")}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Button
        className="py-1 px-2.5"
        variant={"secondary"}
        onClick={() => setOpenAlertMessage(true)}
      >
        <MinusCircle className="w-[17px] text-red-600" />
      </Button>
    </>
  );
};

const DownloadButton = ({ doc }: { doc: any }) => {
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDownload = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${baseUrl}/api/projects/${router.query.project_id}/document/download/${doc.project_document_id}`,
        {
          method: "POST",
          headers: authHeaders(access_token),
        }
      );
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");

      a.download = doc.project_document_file;
      a.href = blobUrl;
      a.click();
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      className={cn("py-1 px-2.5", loading && "loading")}
      variant={"secondary"}
      onClick={onDownload}
      disabled={loading}
    >
      <DownloadCloud className="w-[17px] text-purple-600" />
    </Button>
  );
};
