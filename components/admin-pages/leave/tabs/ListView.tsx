import React from "react";
import { TD, TH } from "../";
import { StatusChip } from "../StatusChip";
import { ActionMenu } from "./Actions";
import { useDelete } from "../useDelete";
import { useApprove } from "../useApprove";
import { useReject } from "../useReject";
import Pagination from "@/components/pagination";
import { Loader2 } from "lucide-react";

type ListViewProps = {
  leaves: any[];
  onUpdate: any;
  isLoading: boolean;
  pager: any;
  onPaginate: (page: any) => void;
  handleEdit: (leave: any) => void;
  canApprove: boolean;
};

export const ListView = ({
  leaves,
  onUpdate,
  isLoading,
  pager,
  onPaginate,
  handleEdit,
  canApprove,
}: ListViewProps) => {
  const { mutateDelete, Dialog: DeleteDialog } = useDelete({
    onDelete: () => {
      onUpdate();
    },
  });
  const { mutateApprove, Dialog: ApproveDialog } = useApprove({
    onApprove: () => {
      onUpdate();
    },
  });
  const { mutateReject, Dialog: RejectDialog } = useReject({
    onReject: () => {
      onUpdate();
    },
  });

  return (
    <div className="px-7 py-3">
      <DeleteDialog />
      <ApproveDialog />
      <RejectDialog />
      <div className="min-h-full">
        <table className="w-full mt-4">
          <thead>
            <tr>
              <TH>Category</TH>
              <TH>Technician</TH>
              <TH>From / To</TH>
              <TH>Days</TH>
              <TH>Reason</TH>
              <TH>Country</TH>
              <TH>Status</TH>
              <TH>Reviewed By</TH>
              <TH>Actions</TH>
            </tr>
          </thead>
          <tbody>
            {leaves?.map((leave: any, i: number) => {
              return (
                <tr key={i} className="even:bg-stone-50 hover:bg-stone-100">
                  <TD>{leave.excuse_category}</TD>
                  <TD>{leave.user_fullname}</TD>
                  <TD>
                    {leave.excuse_from_date}
                    <br />
                    {leave.excuse_to_date}
                  </TD>
                  <TD>{leave.total_days}</TD>
                  <TD>{leave.excuse_reason}</TD>
                  <TD>{leave.country_name}</TD>
                  <TD>
                    <StatusChip status={leave.excuse_status} />
                  </TD>
                  <TD>{leave.reviewer}</TD>
                  <TD>
                    <ActionMenu
                      onDelete={() => mutateDelete(leave.excuse_id)}
                      onEdit={() => handleEdit(leave)}
                      onApprove={(id) => mutateApprove(id)}
                      onReject={(id) => mutateReject(id)}
                      data={leave}
                      canApprove={canApprove}
                    />
                  </TD>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!isLoading && leaves?.length == 0 && (
          <div className="text-center max-w-full p-5">No records found</div>
        )}

        {isLoading && <Loader2 className="animate-spin mx-auto m-5" />}

        {pager && (
          <div className="mt-auto border-t border-t-stone-100 flex justify-end">
            <Pagination pager={pager} onPaginate={onPaginate} />
          </div>
        )}
      </div>
    </div>
  );
};
