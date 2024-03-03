import { Separator } from "@/components/ui/separator";
import { TD, TH } from "@/components/items";
import React, { useContext, useMemo, useState } from "react";
import AddAliasModal from "./modals/AddAliasModal";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { AliasesContext } from ".";

type ClientDetails = {
  renderInvoiceCompany?: React.ReactNode;
  renderInvoiceLocation?: React.ReactNode;
  renderInvoiceContactPerson?: React.ReactNode;
  renderDeliverCompany?: React.ReactNode;
  renderDeliverLocation?: React.ReactNode;
  renderDeliverContactPerson?: React.ReactNode;
  onAddAlias?: (employeeId?: any, aliasName?: any) => void;
  showAddAliasClient?: any;
  showAddAliasDelivery?: any;
  renderAddContactButton?: (type?: "client" | "delivery") => React.ReactNode;
  onRemoveAlias?: (index: number) => void;
};

const ClientDetails = ({
  renderInvoiceCompany,
  renderInvoiceLocation,
  renderInvoiceContactPerson,
  renderDeliverCompany,
  renderDeliverLocation,
  renderDeliverContactPerson,
  onAddAlias,
  showAddAliasClient,
  showAddAliasDelivery,
  renderAddContactButton,
  onRemoveAlias,
}: ClientDetails) => {
  const [openAliasModal, setOpenAliasModal] = useState(false);
  const [aliasType, setALiasType] = useState<any>(null);
  const aliases: any = useContext(AliasesContext);
  const [employeeId, setEmployeeId] = useState(null);

  const withAliases = useMemo(() => {
    // return Array.isArray(aliases)
    //   ? aliases.filter((item: any) => item.alias)
    //   : [];
    return aliases;
  }, [aliases]);

  return (
    <>
      <AddAliasModal
        open={openAliasModal}
        onOpenChange={(open) => setOpenAliasModal(open)}
        onAdded={onAddAlias}
        employeeId={employeeId}
      />

      <div className="bg-background p-6 rounded-app shadow-sm w-1/2">
        <div className="flex flex-col">
          <p className="font-medium text-base">Client Details</p>
          <p className="">Select client details</p>

          <div className="flex gap-3 mt-4">
            <FormGroup
              label="Client (Invoice To)"
              renderCompany={renderInvoiceCompany}
              renderLocation={renderInvoiceLocation}
              renderContact={renderInvoiceContactPerson}
              onAddAlias={() => {
                setOpenAliasModal(true);
                setALiasType("client");
                setEmployeeId(showAddAliasClient);
              }}
              showAddAlias={showAddAliasClient}
              renderAddContactButton={renderAddContactButton}
              type={"client"}
            />

            <FormGroup
              label="Final (Deliver To)"
              renderCompany={renderDeliverCompany}
              renderLocation={renderDeliverLocation}
              renderContact={renderDeliverContactPerson}
              onAddAlias={() => {
                setOpenAliasModal(true);
                setALiasType("final");
                setEmployeeId(showAddAliasDelivery);
              }}
              showAddAlias={showAddAliasDelivery}
              renderAddContactButton={renderAddContactButton}
              type={"delivery"}
            />
          </div>

          {Array.isArray(withAliases) && withAliases.length > 0 && (
            <div className="border rounded-xl mt-3 overflow-hidden">
              <p className="p-3 ps-4 font-medium">Aliases</p>
              <table className="w-full">
                <thead>
                  <tr>
                    <TH className="font-medium ps-4">Name</TH>
                    <TH className="font-medium">Alias</TH>
                    <TH></TH>
                  </tr>
                </thead>
                <tbody>
                  {withAliases.map((item: any, key: number) => (
                    <tr className="group" key={key}>
                      <TD className="group-last:border-b-0 font-medium ps-4">
                        {item.name}
                      </TD>
                      <TD className="group-last:border-b-0">{item.alias}</TD>
                      <TD className="text-right pe-4">
                        <div className="flex justify-end">
                          <Button
                            variant={"secondary"}
                            className="p-1 px-2 flex gap-2"
                            title="Delete"
                            type="button"
                            onClick={() => onRemoveAlias && onRemoveAlias(key)}
                          >
                            <Trash className="w-[18px] text-red-600" /> Remove
                            alias
                          </Button>
                        </div>
                      </TD>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientDetails;

const FormGroup = ({
  label,
  renderContact,
  renderCompany,
  renderLocation,
  onAddAlias,
  showAddAlias,
  renderAddContactButton,
  type,
}: {
  label?: any;
  renderCompany?: React.ReactNode;
  renderLocation?: React.ReactNode;
  renderContact?: React.ReactNode;
  onAddAlias?: () => void;
  showAddAlias?: any;
  renderAddContactButton?: (type?: "client" | "delivery") => React.ReactNode;
  type?: "client" | "delivery";
}) => {
  return (
    <div className="p-3 border rounded-xl w-1/2">
      <p className="font-medium text-base">{label}</p>

      <div className="flex flex-col gap-5">
        <Separator className="mt-3" />
        <div className="flex flex-col gap-1">
          <label className="font-medium">Company</label>
          {renderCompany}
        </div>
        <div className="flex flex-col gap-1">
          <label className="font-medium">Location</label>
          {renderLocation}
        </div>
        <div className="flex flex-col">
          <div className="flex justify-between items-center">
            <label className="font-medium">Contact Person</label>
            <div className="flex gap-1 items-center">
              {showAddAlias && (
                <span
                  className="text-blue-500 cursor-pointer hover:underline"
                  tabIndex={0}
                  onClick={() => onAddAlias && onAddAlias()}
                >
                  Add Alias
                </span>
              )}
              {renderAddContactButton && renderAddContactButton(type)}
            </div>
          </div>
          {renderContact}
        </div>
      </div>
    </div>
  );
};
