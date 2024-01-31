import { Input } from "@/components/ui/input";
import {
  CmsDetailsContext,
  ContactContainerSizeContext,
  LoadingContext,
} from "@/pages/address-manager/[cms_id]";
import { memo, useContext } from "react";
import Location from "./Location";
import { Textarea } from "@/components/ui/textarea";
import _ from "lodash";
import IndustriesSelect from "../../industries-select";
import { cn } from "@/lib/utils";
import { AccessTokenContext } from "@/context/access-token-context";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const DetailsTab = () => {
  const cms: any = useContext(CmsDetailsContext);
  const access_token: any = useContext(AccessTokenContext);
  const detailsLoading: boolean = useContext(LoadingContext);
  const contactSize: any = useContext(ContactContainerSizeContext);

  const handleChangeInput = _.debounce(async (e: any) => {
    try {
      await updateDetails(e.target.name, e.target.value);
    } catch (err: any) {
    } finally {
    }
  }, 1000);

  const handleIndustryChangeInput = _.debounce(async (value: any) => {
    await updateDetails("cms_industry_id", value);
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
    <div
      className="flex gap-3"
      style={{
        flexDirection: contactSize?.width < 720 ? "column" : "row",
      }}
    >
      <div className="flex flex-col gap-3 border p-4 rounded-xl w-full">
        <span className="text-base font-medium">Details</span>

        {detailsLoading && (
          <div className="flex flex-col gap-2">
            <Skeleton className="max-w-[300px] h-[15px]" />
            <Skeleton className="max-w-[200px] h-[15px]" />
          </div>
        )}

        {cms && (
          <>
            <div className="flex flex-col gap-1">
              <label htmlFor="billing">Billing Address</label>
              <Textarea
                id="billing"
                className="border-none bg-stone-100"
                defaultValue={cms?.cms_billing_address}
                onChange={handleChangeInput}
                name="cms_billing_address"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="invoice">Invoice Copy Address</label>
              <Textarea
                id="invoice"
                className="border-none bg-stone-100"
                defaultValue={cms?.cms_invoice_address}
                onChange={handleChangeInput}
                name="cms_invoice_address"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="industry">Industry</label>
              <IndustriesSelect
                onChangeValue={handleIndustryChangeInput}
                value={cms?.cms_industry_id}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="tin">TIN Number</label>
              <Input
                id="tin"
                className="border-none bg-stone-100"
                onChange={handleChangeInput}
                defaultValue={cms?.cms_tin_number}
                name="cms_tin_number"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="eori">EORI Number</label>
              <Input
                id="eori"
                className="border-none bg-stone-100"
                onChange={handleChangeInput}
                defaultValue={cms?.cms_eori_number}
                name="cms_eori_number"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="discount">Discount</label>
              <div
                className={cn(
                  "bg-stone-100 rounded-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 flex justify-between items-center pe-3"
                )}
              >
                <input
                  placeholder="0"
                  className="px-3 py-2.5 text-sm bg-transparent outline-none w-full"
                  onChange={handleChangeInput}
                  name="cms_discount"
                  defaultValue={cms?.cms_discount}
                  type="number"
                />
                <span className="font-bold text-stone-500">%</span>
              </div>
            </div>
          </>
        )}
      </div>
      <Location />
    </div>
  );
};

export default memo(DetailsTab);
