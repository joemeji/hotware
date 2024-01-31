import AvatarProfile from "@/components/AvatarProfile";
import { LoadingListDetailsContext } from "@/pages/projects/loading-list";
import { baseUrl, fetcher } from "@/utils/api.config";
import React, { memo, useContext } from "react";
import useSWR from "swr";

const swrOptions = {
  revalidateOnFocus: false,
  revalidateIfStale: false,
};

function LoadingListDetails(props: LoadingListDetailsProps) {
  const { open } = props;
  const loadingDetails: any = useContext(LoadingListDetailsContext);
  const loadingID = loadingDetails && loadingDetails.loading_id;

  const { data, isLoading, error } = useSWR('/api/loading-list/' + loadingID + '/details', fetcher, swrOptions);

  return (
    <div className="flex flex-col gap-3">
      <div className="rounded-xl border-2 border-stone-200 p-3 flex flex-col gap-2">
        <div className="text-sm text-right flex gap-1">
          <p>Created at</p>
          <p className="font-medium">{formatDate(data && data)}</p>
        </div>
        <div className="flex gap-1 items-center">
          <p className="text-stone-600">by</p>
          <div>
            <AvatarProfile
              firstname={data && data.user_firstname}
              lastname={data && data.user_lastname}
              photo={baseUrl + '/users/thumbnail/' + data && data?.user_photo}
              avatarClassName="w-7 h-7"
              avatarColor={data && data.avatar_color}
              avatarFallbackClassName="font-medium text-white text-xs"
            />
          </div>
          <p className="font-medium">{data && data.added_by_name}</p>
        </div>
      </div>
      <div className="rounded-xl border-2 border-stone-200 p-3 flex flex-col gap-2">
        <div>
          <p className="text-stone-600">Description</p>
        </div>
        <div>
          <p className="font-medium">{data && data.loading_description}</p>
        </div>
      </div>
      <div className="rounded-xl border-2 border-stone-200 p-3 flex flex-col gap-2">
        <div>
          <p className="text-stone-600">Furnace</p>
        </div>
        <div className="flex flex-col">
          <p className="font-medium">{data && data.loading_furnace}</p>
        </div>
      </div>
      <div className="rounded-xl border-2 border-stone-200 p-3 flex flex-col gap-2">
        <div>
          <p className="text-stone-600">Work</p>
        </div>
        <div>
          <p className="font-medium">{data && data.loading_work}</p>
        </div>
      </div>
      <div className="rounded-xl border-2 border-stone-200 p-3 flex flex-col gap-2">
        <div>
          <p className="text-stone-600">Type of Unit</p>
        </div>
        <div>
          <p className="font-medium">{data && data.loading_type_of_unit}</p>
        </div>
      </div>
      <div className="rounded-xl border-2 border-stone-200 p-3 flex flex-col gap-2">
        <div>
          <p className="text-stone-600">Additional Notes</p>
        </div>
        <div>
          <p className="font-medium">{data && data.loading_additional_notes}</p>
        </div>
      </div>
    </div>
  )
}

export default memo(LoadingListDetails);

type LoadingListDetailsProps = {
  open?: any
}

// export const LoadingCreated = () => {
//   const loadingDetails: any = useContext(LoadingListDetailsContext);

//   console.log({ loadingID: loadingDetails })
//   return (
//     <div className="rounded-xl border-2 border-stone-200 p-3 flex flex-col gap-2">
//       <div className="text-sm text-right flex gap-1">
//         <p>Created at</p>
//         <p className="font-medium">{formatDate(loadingDetails && loadingDetails)}</p>
//       </div>
//       <div className="flex gap-1 items-center">
//         <p className="text-stone-600">by</p>
//         <div>
//           <AvatarProfile
//             firstname={loadingDetails && loadingDetails.user_firstname}
//             lastname={loadingDetails && loadingDetails.user_lastname}
//             photo={baseUrl + '/users/thumbnail/' + loadingDetails && loadingDetails?.user_photo}
//             avatarClassName="w-7 h-7"
//             avatarColor={loadingDetails && loadingDetails.avatar_color}
//             avatarFallbackClassName="font-medium text-white text-xs"
//           />
//         </div>
//         <p className="font-medium">{loadingDetails && loadingDetails.user_firstname} {loadingDetails && loadingDetails.user_lastname}</p>
//       </div>
//     </div>
//   )
// }

const formatDate = (data: any) => {
  if (!data || !data.added_date) {
    return 'Invalid Date';
  }

  const year = parseInt(data.added_date.substring(0, 4));
  const month = parseInt(data.added_date.substring(4, 6)) - 1;
  const day = parseInt(data.added_date.substring(6, 8));
  const hour = parseInt(data.added_date.substring(8, 10));
  const minute = parseInt(data.added_date.substring(10, 12));
  const second = parseInt(data.added_date.substring(12, 14));

  // Create a Date object
  const formattedDate = new Date(year, month, day, hour, minute, second).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  });

  return formattedDate;
}

// export const LoadingDescription = () => {
//   const loadingDetails: any = useContext(LoadingListDetailsContext);
//   return (
//     <div className="rounded-xl border-2 border-stone-200 p-3 flex flex-col gap-2">
//       <div>
//         <p className="text-stone-600">Description</p>
//       </div>
//       <div>
//         <p className="font-medium">{loadingDetails && loadingDetails.loading_description}</p>
//       </div>
//     </div>
//   )
// }

// export const LoadingFurnace = () => {
//   const loadingDetails: any = useContext(LoadingListDetailsContext);
//   return (
//     <div className="rounded-xl border-2 border-stone-200 p-3 flex flex-col gap-2">
//       <div>
//         <p className="text-stone-600">Furnace</p>
//       </div>
//       <div className="flex flex-col">
//         <p className="font-medium">{loadingDetails && loadingDetails.loading_furnace}</p>
//       </div>
//     </div>
//   )
// }

// export const LoadingWork = () => {
//   const loadingDetails: any = useContext(LoadingListDetailsContext);
//   return (
//     <div className="rounded-xl border-2 border-stone-200 p-3 flex flex-col gap-2">
//       <div>
//         <p className="text-stone-600">Work</p>
//       </div>
//       <div>
//         <p className="font-medium">{loadingDetails && loadingDetails.loading_work}</p>
//       </div>
//     </div>
//   )
// }

// export const LoadingTypeUnit = () => {
//   const loadingDetails: any = useContext(LoadingListDetailsContext);
//   return (
//     <div className="rounded-xl border-2 border-stone-200 p-3 flex flex-col gap-2">
//       <div>
//         <p className="text-stone-600">Type of Unit</p>
//       </div>
//       <div>
//         <p className="font-medium">{loadingDetails && loadingDetails.loading_type_of_unit}</p>
//       </div>
//     </div>
//   )
// }

// export const LoadingAdditionalNotes = () => {
//   const loadingDetails: any = useContext(LoadingListDetailsContext);
//   return (
//     <div className="rounded-xl border-2 border-stone-200 p-3 flex flex-col gap-2">
//       <div>
//         <p className="text-stone-600">Additional Notes</p>
//       </div>
//       <div>
//         <p className="font-medium">{loadingDetails && loadingDetails.loading_additional_notes}</p>
//       </div>
//     </div>
//   )
// }