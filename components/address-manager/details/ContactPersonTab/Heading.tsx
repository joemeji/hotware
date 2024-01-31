import { Button } from "@/components/ui/button";
import { AccessTokenContext } from "@/context/access-token-context";
import { cn } from "@/lib/utils";
import { CmsDetailsContext } from "@/pages/address-manager/[cms_id]";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { FileText, Plus } from "lucide-react";
import { memo, useContext, useState } from "react";

const Heading = ({ onClickCreateContact }: Heading) => {
  const cms: any = useContext(CmsDetailsContext);
  const access_token: any = useContext(AccessTokenContext);
  const [loadingExport, setLoadingExport] = useState(false);

  const onExport = async () => {
    try {
      setLoadingExport(true);
      const res = await fetch(
        `${baseUrl}/api/cms/export_contact/${cms?._cms_id}`,
        {
          headers: { ...authHeaders(access_token) },
        }
      );
      const blob = await res.blob();
      const objectURL = URL.createObjectURL(blob);
      window.open(objectURL, "_blank");
    } catch (err: any) {
      setLoadingExport(false);
    } finally {
      setLoadingExport(false);
    }
  };

  return (
    <>
      <div className="flex justify-between items-start">
        <span className="text-base font-medium">Contact Persons</span>
        <div className="flex items-center gap-2">
          <Button
            className="flex gap-2 py-1 items-center"
            variant={"secondary"}
            onClick={onClickCreateContact}
          >
            <Plus className="text-indigo-500 w-[18px]" /> New Contact
          </Button>
          <Button
            className={cn(
              "flex gap-2 py-1 items-center",
              loadingExport && "loading"
            )}
            variant={"secondary"}
            onClick={onExport}
            disabled={loadingExport}
          >
            <FileText className="w-[18px] text-rose-500" />
            Export
          </Button>
        </div>
      </div>
    </>
  );
};

export default memo(Heading);

type Heading = {
  onClickCreateContact?: () => void;
};
