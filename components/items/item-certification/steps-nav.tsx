import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { steps } from "@/data/ventilatorData";
import { steps as edbSteps } from "@/data/edbChineseData";
import { cn } from "@/lib/utils";
import { Video } from "lucide-react";
import React, { useState } from "react";
import { useRouter } from "next/router";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { steps as edbMushroomSteps } from "@/data/edbMushroomData";

interface StepsNavProps {
  onClickStep?: (stepIndex: number) => void;
  stepSelectedIndex?: number;
  form?: any;
  access_token?: string;
}

const StepsNav = React.forwardRef((props: StepsNavProps, ref: any) => {
  const router = useRouter();
  const [loadingNext, setLoadingNext] = useState(false);
  const [isCheckAcknowledge, setIsCheckAcknowledge] = useState<boolean>(false);
  const { onClickStep, stepSelectedIndex, form, access_token } = props;

  const onClickNext = async () => {
    const { itemId, form } = router.query;
    const payload: any = { form_id: form };

    if (Array.isArray(itemId) && itemId.length === 2) {
      payload["item_type"] = itemId[1];
      payload["item_ref_id"] = itemId[0];
    }

    try {
      setLoadingNext(true);
      const res = await fetch(baseUrl + "/api/forms/save_item_selected_form", {
        method: "POST",
        headers: { ...authHeaders(access_token) },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json && json.success) {
        router.push(
          `/items/item-certification/form/${payload["item_ref_id"]}/${payload["item_type"]}?form=${form}`
        );
      }
      console.log();
      setLoadingNext(false);
    } catch (err: any) {
      console.log("Error: " + err.message);
      setLoadingNext(false);
    }

    console.log(payload);
  };

  function stepsList() {
    if (form) {
      if (form.form_type === "pump_oil") return [];
      if (form.form_type === "gas_safety_skid") return [];
      if (form.form_type === "oil_safety_skid") return [];
      if (form.form_type === "gas_burner") return [];
      if (form.form_type === "oil_burner") return [];
      if (
        form.form_type === "combusion_ka_15" ||
        form.form_type === "combustion_ka_15" ||
        form.form_type === "combustion_ch_7_5" ||
        form.form_type === "combustion_ch_15" ||
        form.form_type === "combustion_london_15"
      )
        return [...steps];
      if (form.form_type === "edb_ch_chinese") return [...edbSteps];
      if (form.form_type === "edb_ch_mushroom") return [...edbMushroomSteps];
    }
    return [];
  }

  return (
    <div className="w-[27%] bg-white h-[calc(100vh-var(--header-height)-30px)] sticky mt-[15px] top-[calc(var(--header-height)+15px)] rounded-xl flex flex-col p-2 shadow-sm">
      <ScrollArea
        ref={ref}
        className="h-[calc(100vh-var(--header-height)-50px)] py-2"
      >
        <p className="text-xl font-medium ms-3">Steps</p>
        <div className="gap-1 mt-3">
          {stepsList().map((step: string, key: number) => (
            <button
              key={key}
              className={cn(
                "hover:bg-stone-100 text-left py-2.5 px-3 flex gap-3 rounded-xl w-full",
                stepSelectedIndex === key && "bg-stone-200 hover:bg-stone-200"
              )}
              onClick={() => onClickStep && onClickStep(key)}
            >
              <span
                className={cn(
                  "px-2 bg-stone-200 w-[30px] h-[30px] flex items-center justify-center font-medium rounded-full"
                )}
              >
                {key + 1}
              </span>
              <span className="w-[calc(100%-30px)] text-stone-950">{step}</span>
            </button>
          ))}
        </div>
      </ScrollArea>
      <button
        className={cn(
          "border-2 border-green-200 hover:bg-green-200 py-2.5 px-3 flex gap-3 rounded-xl w-full font-medium mt-auto mb-2",
          "flex justify-center mt-auto"
        )}
      >
        <Video /> Watch Video
      </button>
      <label
        htmlFor="acknowledgement"
        className="flex gap-4 py-5 hover:bg-stone-100 mb-2 px-3 rounded-xl mt-auto"
      >
        <Checkbox
          id="acknowledgement"
          className="rounded-full h-5 w-5 border-2"
          checked={isCheckAcknowledge}
          onCheckedChange={(isChecked: boolean) =>
            setIsCheckAcknowledge(isChecked)
          }
        />
        <p>
          I hereby acknowledge that I have read and understood the above
          equipment check protocol.
        </p>
      </label>
      <button
        className={cn(
          "p-3 flex gap-3 rounded-full mt-auto w-full text-center",
          "bg-stone-900 hover:disabled:bg-stone-900 hover:bg-stone-800/90",
          "disabled:opacity-40"
        )}
        onClick={onClickNext}
        disabled={loadingNext || !isCheckAcknowledge}
      >
        <span className="w-[calc(100%-30px)] text-stone-50 font-medium">
          Next
        </span>
      </button>
    </div>
  );
});

StepsNav.displayName = "StepsNav";

export default StepsNav;
