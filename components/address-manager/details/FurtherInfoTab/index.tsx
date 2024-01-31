import { Input } from "@/components/ui/input";
import { CmsDetailsContext } from "@/pages/address-manager/[cms_id]";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { memo, useContext, useState } from "react";
import { AccessTokenContext } from "@/context/access-token-context";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import _ from "lodash";
import { toast } from "@/components/ui/use-toast";

const FurtherInfoTab = () => {
  const cms: any = useContext(CmsDetailsContext);
  const access_token = useContext(AccessTokenContext);

  const handleChangeInput = _.debounce(async (e: any) => {
    await updateDetails(e.target.name, e.target.value);
  }, 1000);

  const handleCheckedChangeMemo = _.debounce(async (checked: any) => {
    await updateDetails("cms_memo", checked ? 1 : 0);
  }, 1000);

  const updateDetails = async (name: any, value: any) => {
    const res = await fetch(
      `${baseUrl}/api/cms/update_contact_other_details/${cms?._cms_id}`,
      {
        method: "POST",
        headers: authHeaders(access_token),
        body: JSON.stringify({
          [name]: value,
        }),
      }
    );
    const json = await res.json();
    if (json.success) {
      toast({
        title: "Successfully updated.",
        variant: "default",
        duration: 1000,
      });
    }
  };

  return (
    <>
      <div className="flex flex-col gap-3 border rounded-xl">
        <div className="pt-4 px-4">
          <div className="flex justify-between items-center">
            <span className="text-base font-medium">Further Info</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 p-3">
          <div className="flex flex-col gap-2">
            <span className="font-medium">CMS memo</span>
            <Textarea
              className="bg-stone-100 border-none"
              placeholder="CMS memo"
              name="cms_memo"
              onChange={handleChangeInput}
              defaultValue={cms?.cms_memo}
            />
          </div>
          <label htmlFor="warning" className="flex items-center gap-2 w-fit">
            <Checkbox
              id="warning"
              className="rounded-none w-[17px] h-[17px]"
              defaultChecked={cms?.cms_memo_warning === "1"}
              onCheckedChange={handleCheckedChangeMemo}
            />
            <span className="font-medium">Activate memo warning</span>
          </label>

          <Separator />
          <div className="flex flex-col gap-2 my-2">
            <span className="font-medium">Hotware No.</span>
            <Input
              className="bg-stone-100 border-none"
              placeholder="Hotware No."
              name="hotware_number"
              defaultValue={cms?.cms_id}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2 my-2">
            <span className="font-medium">Abacus Client No.</span>
            <Input
              className="bg-stone-100 border-none"
              placeholder="Abacus Client No."
              name="cms_abacus_client_number"
              defaultValue={cms?.cms_abacus_client_number}
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2 my-2">
            <span className="font-medium">Custom No.</span>
            <Input
              className="bg-stone-100 border-none"
              placeholder="Custom No."
              name="cms_custom_number"
              defaultValue={cms?.cms_custom_number}
              onChange={handleChangeInput}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(FurtherInfoTab);
