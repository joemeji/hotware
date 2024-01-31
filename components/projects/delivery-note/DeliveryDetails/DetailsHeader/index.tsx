import AvatarProfile from "@/components/AvatarProfile";
import { DeliveryNoteDetailsContext } from "@/context/delivery-note-details-content";
import { baseUrl } from "@/utils/api.config";
import dayjs from "dayjs";
import React, { memo, useContext } from "react";
import DetailsActions from "./DetailsActions";

type DetailsHeaderParams = {
  _delivery_note_id: string | undefined;
};

const DetailsHeader = ({ _delivery_note_id }: DetailsHeaderParams) => {
  const deliveryNoteData: any = useContext(DeliveryNoteDetailsContext);

  const firstname = deliveryNoteData
    ? deliveryNoteData.updatedBy_firstname
    : null;
  const lastname = deliveryNoteData
    ? deliveryNoteData.updatedBy_lastname
    : null;
  const avatarColor = deliveryNoteData
    ? deliveryNoteData.updatedBy_avatar_color
    : null;
  const userPhoto = deliveryNoteData
    ? deliveryNoteData.updatedBy_user_photo
    : null;

  const updatedData = deliveryNoteData
    ? deliveryNoteData.updated_date
      ? dayjs(deliveryNoteData.updated_date).format("MMMM DD, YYYY HH:DD a")
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

      <DetailsActions _delivery_note_id={_delivery_note_id} />
    </div>
  );
};

export default memo(DetailsHeader);
