import AvatarProfile from "@/components/AvatarProfile";
import { CreditNoteDetailsContext } from "@/context/credit-note-details-context";
import { baseUrl } from "@/utils/api.config";
import dayjs from "dayjs";
import React, { memo, useContext } from "react";
import DetailsActions from "./DetailsActions";

type DetailsHeaderParams = {
  _credit_note_id: string | undefined;
};

const DetailsHeader = ({ _credit_note_id }: DetailsHeaderParams) => {
  const creditNoteData: any = useContext(CreditNoteDetailsContext);

  const firstname = creditNoteData ? creditNoteData.updatedBy_firstname : null;
  const lastname = creditNoteData ? creditNoteData.updatedBy_lastname : null;
  const avatarColor = creditNoteData
    ? creditNoteData.updatedBy_avatar_color
    : null;
  const userPhoto = creditNoteData ? creditNoteData.updatedBy_user_photo : null;

  const updatedData = creditNoteData
    ? creditNoteData.updated_date
      ? dayjs(creditNoteData.updated_date).format("MMMM DD, YYYY HH:DD a")
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

      <DetailsActions _credit_note_id={_credit_note_id} />
    </div>
  );
};

export default memo(DetailsHeader);
