import AvatarProfile from "@/components/AvatarProfile";
import { OrderConfirmationDetailsContext } from "@/context/order-confirmation-details-content";
import { baseUrl } from "@/utils/api.config";
import dayjs from "dayjs";
import React, { memo, useContext } from "react";
import DetailsActions from "./DetailsActions";

type DetailsHeaderParams = {
  _order_confirmation_id: string | undefined;
};

const DetailsHeader = ({ _order_confirmation_id }: DetailsHeaderParams) => {
  const orderConfirmationData: any = useContext(
    OrderConfirmationDetailsContext
  );

  const firstname = orderConfirmationData
    ? orderConfirmationData.updatedBy_firstname
    : null;
  const lastname = orderConfirmationData
    ? orderConfirmationData.updatedBy_lastname
    : null;
  const avatarColor = orderConfirmationData
    ? orderConfirmationData.updatedBy_avatar_color
    : null;
  const userPhoto = orderConfirmationData
    ? orderConfirmationData.updatedBy_user_photo
    : null;

  const updatedData = orderConfirmationData
    ? orderConfirmationData.updated_date
      ? dayjs(orderConfirmationData.updated_date).format(
          "MMMM DD, YYYY HH:DD a"
        )
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

      <DetailsActions _order_confirmation_id={_order_confirmation_id} />
    </div>
  );
};

export default memo(DetailsHeader);
