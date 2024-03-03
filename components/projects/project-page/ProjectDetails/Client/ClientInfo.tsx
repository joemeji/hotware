import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const ClientInfo = (props: ClientInfoProps) => {
  const { cms } = props;
  let addressString = "";
  if (cms) {
    if (cms.cms_address_building)
      addressString += cms.cms_address_building + ", ";
    if (cms.cms_address_street) addressString += cms.cms_address_street + ", ";
    addressString += "\u000D\u000A"; // Add line break
    if (cms.cms_address_zip) addressString += cms.cms_address_zip + " ";
    if (cms.cms_address_city) addressString += cms.cms_address_city + ", ";
    if (cms.cms_address_country) addressString += cms.cms_address_country;
  }

  let siteAddressString = "";
  if (cms) {
    if (cms.site_address_building)
      siteAddressString += cms.site_address_building + ", ";
    if (cms.site_address_street)
      siteAddressString += cms.site_address_street + ", ";
    siteAddressString += "\u000D\u000A"; // Add line break
    if (cms.site_address_zip) siteAddressString += cms.site_address_zip + " ";
    if (cms.site_address_city)
      siteAddressString += cms.site_address_city + ", ";
    if (cms.site_address_country) siteAddressString += cms.site_address_country;
  }

  return (
    <div
      className="bg-background w-1/2 rounded-xl overflow-hidden shadow"
      // style={{
      //   height: `calc(100vh - (var(--header-height) + ${
      //     headerSize?.height + 40
      //   }px))`,
      // }}
    >
      <div className="flex justify-between p-3 sticky top-0 z-10 backdrop-blur-sm">
        <p className="font-medium text-lg">Client</p>
      </div>

      <div className="flex flex-col gap-5 p-4 relative min-h-[350px]">
        <div className="flex flex-col gap-1">
          <label className="font-medium">Name</label>
          <div className="flex items-center gap-1">
            <Input
              value={cms && cms.cms_name}
              readOnly
              placeholder="Name"
              className="bg-stone-100 border-0"
              // error={errors && (errors.offer_item_name ? true : false)}
              // {...register("offer_item_name")}
            />
            {cms && cms._cms_id && (
              <Link
                href={`/address-manager/${cms && cms._cms_id}`}
                target="_blank"
              >
                <Button
                  variant={"secondary"}
                  className="px-2.5 py-2 text-red-700"
                >
                  <ArrowUpRight className="w-[17px]" />
                </Button>
              </Link>
            )}

            {/* {errors.offer_item_name && (
                  <span className="text-red-500 text-sm">
                    <>{errors.offer_item_name?.message}</>
                  </span>
                )} */}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium">Contact Number</label>
          <div>
            <Input
              value={cms && cms.cms_phone_number}
              readOnly
              placeholder="Contact Number"
              className="bg-stone-100 border-0"
              // error={errors && (errors.offer_item_name ? true : false)}
              // {...register("offer_item_name")}
            />
            {/* {errors.offer_item_name && (
                  <span className="text-red-500 text-sm">
                    <>{errors.offer_item_name?.message}</>
                  </span>
                )} */}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium">Email</label>
          <div>
            <Input
              value={cms && cms.cms_email}
              readOnly
              placeholder="Email"
              className="bg-stone-100 border-0"
              // error={errors && (errors.offer_item_name ? true : false)}
              // {...register("offer_item_name")}
            />
            {/* {errors.offer_item_name && (
                  <span className="text-red-500 text-sm">
                    <>{errors.offer_item_name?.message}</>
                  </span>
                )} */}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium">Address</label>
          <div>
            <Textarea
              value={addressString && addressString}
              readOnly
              placeholder="Address"
              className="bg-stone-100 border-0"
              // error={errors && (errors.offer_item_name ? true : false)}
              // {...register("offer_item_name")}
            />
            {/* {errors.offer_item_name && (
                  <span className="text-red-500 text-sm">
                    <>{errors.offer_item_name?.message}</>
                  </span>
                )} */}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium">Site Address</label>
          <div>
            <Textarea
              value={siteAddressString && siteAddressString}
              readOnly
              placeholder="Site Address"
              className="bg-stone-100 border-0"
              // error={errors && (errors.offer_item_name ? true : false)}
              // {...register("offer_item_name")}
            />
            {/* {errors.offer_item_name && (
                  <span className="text-red-500 text-sm">
                    <>{errors.offer_item_name?.message}</>
                  </span>
                )} */}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium">Furnace/Unit No.</label>
          <div>
            <Textarea
              value={cms && cms.project_factory_place}
              readOnly
              placeholder="Furnace/Unit No."
              className="bg-stone-100 border-0"
              // error={errors && (errors.offer_item_name ? true : false)}
              // {...register("offer_item_name")}
            />
            {/* {errors.offer_item_name && (
                  <span className="text-red-500 text-sm">
                    <>{errors.offer_item_name?.message}</>
                  </span>
                )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInfo;

type ClientInfoProps = {
  cms?: any;
};
