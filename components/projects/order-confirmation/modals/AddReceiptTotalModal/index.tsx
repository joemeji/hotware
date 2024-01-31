import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useEffect, useState, useRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import VatSelect from "@/components/app/vat-select";
import ReceiptTotalTypeSelect from "@/components/app/receipt-total-type-select";
import { XIcon } from "lucide-react";
import { useReceiptTotal } from "./useReceiptTotal";
import useSWR, { useSWRConfig } from "swr";
import { isEqual } from "lodash";

function AddReceiptTotalModal(props: AddReceiptTotalModalProps) {
  const { data: session }: any = useSession();
  const { open, onOpenChange, _order_confirmation_id } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useSWRConfig();
  const prevData = useRef(null);
  const { data, isLoading } = useSWR(
    session?.user?.access_token
      ? [
          `/api/projects/orders/receipt_totals/${_order_confirmation_id}`,
          session?.user?.access_token,
        ]
      : null,
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );
  const {
    list: surcharges,
    setList: setSurcharges,
    add: addSurcharge,
    remove: removeSurcharge,
    onChange: onChangeSurcharge,
    onChangeValue: onChangeSurchargeValue,
    handleValueKeyDown: handleSurchargeValueKeyDown,
    onChangeText: onChangeSurchargeText,
    handleTextKeyDown: handleSurchargeTextKeyDown,
  } = useReceiptTotal();
  const {
    list: deductions,
    setList: setDeductions,
    add: addDeduction,
    remove: removeDeduction,
    onChange: onChangeDeduction,
    onChangeValue: onChangeDeductionValue,
    handleValueKeyDown: handleDeductionValueKeyDown,
    onChangeText: onChangeDeductionText,
    handleTextKeyDown: handleDeductionTextKeyDown,
  } = useReceiptTotal();

  const onSubmitEditForm = async (e: any) => {
    e.preventDefault();
    const filteredSurcharges = surcharges
      .filter((surcharge) => surcharge.ocrt_value && surcharge.ocrt_text)
      .map((surcharge) => ({ ...surcharge, ocrt_is_surcharge: 1 }));
    const filteredDeductions = deductions
      .filter((deduction) => deduction.ocrt_value && deduction.ocrt_text)
      .map((surcharge) => ({ ...surcharge, ocrt_is_surcharge: 0 }));

    const list = [...filteredSurcharges, ...filteredDeductions];
    // if (!list || !list.length) return;

    try {
      setIsSubmitting(true);
      const response = await fetch(
        `${baseUrl}/api/projects/orders/receipt_totals/${_order_confirmation_id}`,
        {
          headers: authHeaders(session?.user?.access_token),
          method: "POST",
          body: JSON.stringify({ receipt_totals: list }),
        }
      );
      const json = await response.json();
      setIsSubmitting(false);

      if (json.success) {
        onOpenChange && onOpenChange(false);
        mutate([
          `/api/projects/orders/receipt_totals/${_order_confirmation_id}`,
          session?.user?.access_token,
        ]);
      }
    } catch (err: any) {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (data && data.length) {
      const existingSurcharges = data.filter(
        (receiptTotal: any) => receiptTotal.ocrt_is_surcharge == 1
      );
      const existingDeductions = data.filter(
        (receiptTotal: any) => receiptTotal.ocrt_is_surcharge == 0
      );

      // Check if data has changed before updating state
      if (!isEqual(prevData.current, data)) {
        setSurcharges(existingSurcharges);
        setDeductions(existingDeductions);
        // Update the reference variable to the current data
        prevData.current = data;
      }
    }
  }, [data, setSurcharges, setDeductions]);

  return (
    <Dialog
      open={open}
      onOpenChange={(open) =>
        !isSubmitting && onOpenChange && onOpenChange(open)
      }
    >
      <DialogContent
        forceMount
        className="max-w-[920px] p-0 overflow-auto gap-0 outline-none"
      >
        <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-background z-10">
          <DialogTitle>Receipt Total</DialogTitle>
          <DialogPrimitive.Close
            disabled={isSubmitting}
            className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200"
          >
            <X />
          </DialogPrimitive.Close>
        </DialogHeader>
        <form onSubmit={onSubmitEditForm}>
          <div className="flex flex-col gap-3 p-4 relative">
            <div>
              Here you can enter surcharges and deductions as a percentage or
              absolute value.
            </div>
            <div>
              <span className="text-red-500">Note</span>: Empty text or zero
              value will not be added.
            </div>
            <div>
              <table className="w-full border border-[#e4e7ea]">
                <thead>
                  <tr className="bg-gradient-to-r from-[#bd4f6c] to-[#d7816a] text-white">
                    <th colSpan={5}>
                      <div className="flex p-2">
                        <div className="flex-1 text-left">SURCHARGES</div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addSurcharge();
                          }}
                        >
                          Add new line
                        </button>
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <th className="w-[20%] border border-[#e4e7ea] p-2">
                      Type
                    </th>
                    <th className="w-[20%] border border-[#e4e7ea] p-2">
                      Value
                    </th>
                    <th className="w-[30%] border border-[#e4e7ea] p-2">
                      Text
                    </th>
                    <th className="w-[20%] border border-[#e4e7ea] p-2">VAT</th>
                    <th className="w-[10%] border border-[#e4e7ea] p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {surcharges.map((surcharge, index) => (
                    <tr key={index}>
                      <td className="w-[10%] border border-[#e4e7ea] p-2">
                        <ReceiptTotalTypeSelect
                          modal={true}
                          value={surcharge.ocrt_type}
                          onChangeValue={(value) =>
                            onChangeSurcharge(index, { ocrt_type: value })
                          }
                        />
                      </td>
                      <td
                        className="w-[10%] border border-[#e4e7ea] p-2"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        onBlur={(e: any) => onChangeSurchargeValue(index, e)}
                        onKeyDown={(e: any) =>
                          handleSurchargeValueKeyDown(index, e)
                        }
                      >
                        {surcharge.ocrt_value}
                      </td>
                      <td
                        className="w-[10%] border border-[#e4e7ea] p-2"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        dangerouslySetInnerHTML={{
                          __html: surcharge.ocrt_text,
                        }}
                        onBlur={(e: any) => onChangeSurchargeText(index, e)}
                        onKeyDown={(e: any) =>
                          handleSurchargeTextKeyDown(index, e)
                        }
                      ></td>
                      <td className="w-[10%] border border-[#e4e7ea] p-2">
                        <VatSelect
                          modal={true}
                          value={surcharge.ocrt_vat}
                          onChangeValue={(value) =>
                            onChangeSurcharge(index, { ocrt_vat: value })
                          }
                        />
                      </td>
                      <td className="w-[10%] border border-[#e4e7ea] p-2">
                        <button
                          type="button"
                          onClick={() => removeSurcharge(index)}
                          className="w-full flex justify-center"
                        >
                          <XIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div>
              <table className="w-full border border-[#e4e7ea]">
                <thead>
                  <tr className="bg-gradient-to-r from-[#bd4f6c] to-[#d7816a] text-white">
                    <th colSpan={5}>
                      <div className="flex p-2">
                        <div className="flex-1 text-left">DEDUCTIONS</div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addDeduction();
                          }}
                        >
                          Add new line
                        </button>
                      </div>
                    </th>
                  </tr>
                  <tr>
                    <th className="w-[20%] border border-[#e4e7ea] p-2">
                      Type
                    </th>
                    <th className="w-[20%] border border-[#e4e7ea] p-2">
                      Value
                    </th>
                    <th className="w-[30%] border border-[#e4e7ea] p-2">
                      Text
                    </th>
                    <th className="w-[20%] border border-[#e4e7ea] p-2">VAT</th>
                    <th className="w-[10%] border border-[#e4e7ea] p-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {deductions.map((deduction, index) => (
                    <tr key={index}>
                      <td className="w-[10%] border border-[#e4e7ea] p-2">
                        <ReceiptTotalTypeSelect
                          modal={true}
                          value={deduction.ocrt_type}
                          onChangeValue={(value) =>
                            onChangeDeduction(index, { ocrt_type: value })
                          }
                        />
                      </td>
                      <td
                        className="w-[10%] border border-[#e4e7ea] p-2"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        onBlur={(e: any) => onChangeDeductionValue(index, e)}
                        onKeyDown={(e: any) =>
                          handleDeductionValueKeyDown(index, e)
                        }
                      >
                        {deduction.ocrt_value}
                      </td>
                      <td
                        className="w-[10%] border border-[#e4e7ea] p-2"
                        contentEditable="true"
                        suppressContentEditableWarning={true}
                        dangerouslySetInnerHTML={{
                          __html: deduction.ocrt_text,
                        }}
                        onBlur={(e: any) => onChangeDeductionText(index, e)}
                        onKeyDown={(e: any) =>
                          handleDeductionTextKeyDown(index, e)
                        }
                      ></td>
                      <td className="w-[10%] border border-[#e4e7ea] p-2">
                        <VatSelect
                          modal={true}
                          value={deduction.ocrt_vat}
                          onChangeValue={(value) =>
                            onChangeDeduction(index, { ocrt_vat: value })
                          }
                        />
                      </td>
                      <td className="w-[10%] border border-[#e4e7ea] p-2">
                        <button
                          type="button"
                          onClick={() => removeDeduction(index)}
                          className="w-full flex justify-center"
                        >
                          <XIcon />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <DialogFooter className="p-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className={cn(isSubmitting && "loading")}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default memo(AddReceiptTotalModal);

type AddReceiptTotalModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  _order_confirmation_id: any;
  onUpdated?: (id?: any, newVal?: any) => void;
};
