import AvatarProfile from "@/components/AvatarProfile";
import { baseUrl } from "@/utils/api.config";
import dayjs from "dayjs";
import React, { memo } from "react";
import DetailsActions from "./DetailsActions";

type DetailsHeaderParams = {
  _order_confirmation_id: string | undefined;
  data: any;
};

const DetailsHeader = ({
  _order_confirmation_id,
  data,
}: DetailsHeaderParams) => {
  const firstname = data?.updatedBy_firstname || null;
  const lastname = data?.updatedBy_lastname || null;
  const avatarColor = data?.updatedBy_avatar_color || null;
  const userPhoto = data?.updatedBy_user_photo || null;
  const updatedData = data?.updated_date
    ? dayjs(data.updated_date).format("MMMM DD, YYYY HH:DD a")
    : "-";

  return (
    <div className="flex justify-between py-2 px-3 bg-background rounded-sm mb-2 items-center">
      <div className="flex flex-col gap-1">
        <p className="text-lg font-medium">
          Manage Contents{" "}
          {data?.order_confirmation_number && (
            <span>
              {"{ "}
              <span style={{ color: "red" }}>
                {data.order_confirmation_number}
              </span>
              {" }"}
            </span>
          )}
        </p>
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

      <DetailsActions
        _order_confirmation_id={_order_confirmation_id}
        data={data}
      />
    </div>
  );
};

export default memo(DetailsHeader);
