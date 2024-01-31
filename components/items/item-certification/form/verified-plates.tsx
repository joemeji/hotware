import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export default function VerifiedPlates({ formData, formPlates, onChangeFormPlates }: any) {

  const formValue = (key: number) => {
    if (formPlates[key] && formPlates[key].included) {
      return formPlates[key].included;
    }
    return false;
  };

  const onCheckPlate = (key: number, isChecked: boolean) => {
    const _formPlates = [...formPlates];
    _formPlates[key].included = isChecked;
    onChangeFormPlates && onChangeFormPlates(_formPlates);
  };

  return (
    <div className="flex flex-col w-full max-w-[600px] border border-stone-100 mx-auto rounded-xl overflow-hidden p-3 gap-2">
      <span className="flex font-medium py-2 px-3">
        Verified Plates
      </span>
      {formData && formData.form_plates.map((item: any, key: number) => (
        <label 
          key={key} 
          className={cn(
            "bg-stone-50 hover:bg-stone-100 flex items-center py-4 px-3 cursor-pointer rounded-xl justify-between",
            formValue(key) && "bg-stone-200 hover:bg-stone-200"
          )}
          htmlFor={`form-pates-${key}`}
        >
          <Checkbox 
            id={`form-pates-${key}`} 
            className="h-0 w-0 rounded-full invisible absolute" 
            value={item.plates_id}
            checked={formValue(key)}
            onCheckedChange={(isChecked: boolean) => onCheckPlate(key, isChecked)}
          />
          <span>{item.form_plates_name}</span>
          {formValue(key) && <Check strokeWidth={3} className="text-blue-500 mr-2 h-5 w-5" />}
        </label>
      ))}
    </div>
  )
}