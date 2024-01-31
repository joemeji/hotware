import AvatarProfile from "@/components/AvatarProfile";
import { InvoiceDetailsContext } from "@/context/invoice-details-content";
import { baseUrl } from "@/utils/api.config";
import dayjs from "dayjs";
import React, { memo, useContext } from "react";
import DetailsActions from "./DetailsActions";

type DetailsHeaderParams = {
  _invoice_id: string | undefined;
};

const DetailsHeader = ({ _invoice_id }: DetailsHeaderParams) => {
  const invoiceData: any = useContext(InvoiceDetailsContext);

  const firstname = invoiceData ? invoiceData.updatedBy_firstname : null;
  const lastname = invoiceData ? invoiceData.updatedBy_lastname : null;
  const avatarColor = invoiceData ? invoiceData.updatedBy_avatar_color : null;
  const userPhoto = invoiceData ? invoiceData.updatedBy_user_photo : null;

  const updatedData = invoiceData
    ? invoiceData.updated_date
      ? dayjs(invoiceData.updated_date).format("MMMM DD, YYYY HH:DD a")
      : "-"
    : null;

  return (
    <div className="flex justify-between py-2 px-3 bg-background rounded-sm mb-2 items-center">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-medium">Manage Contents</p>
        <div className="flex gap-1 items-center">
          <span className="text-stone-500">Updated by:</span>
          <AvatarProfile
            firstname={firstname}
            lastname={lastname}
            photo={baseUrl + "/users/thumbnail/" + userPhoto}
            avatarFallbackClassName="text-sm font-medium text-white"
            avatarClassName="w-6 h-6"
            avatarColor={avatarColor}
          />
          <span className="font-medium">
            {firstname} {lastname}
          </span>
          <span className="text-stone-500">@</span>
          <span>{updatedData}</span>
        </div>
      </div>

      <DetailsActions _invoice_id={_invoice_id} />
    </div>
  );
};

export default memo(DetailsHeader);
