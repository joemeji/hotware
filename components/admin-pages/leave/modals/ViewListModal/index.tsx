import React, { useState } from "react";
import GenericModal from "@/components/admin-pages/company-letters/modals/GenericModal";
import { TD, TH } from "../..";
import { StatusChip } from "../../StatusChip";

export const ViewListModal = (props: ViewListModalProps) => {
  const { open, leaves, onOpenChange } = props;

  return (
    <GenericModal
      open={open}
      onOpenChange={onOpenChange}
      title="Technician Leaves"
      className="max-w-[910px]"
    >
      <div className="pb-5 px-7">
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
                </tr>
              );
            })}
            {!leaves?.length ? (
              <tr>
                <TD colspan={3} className="text-center">
                  No records found.
                </TD>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </GenericModal>
  );
};

type ViewListModalProps = {
  open?: boolean;
  leaves?: any[];
  onOpenChange?: (open: boolean) => void;
};
