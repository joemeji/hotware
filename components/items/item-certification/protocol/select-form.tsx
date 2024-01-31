import { MoveRight } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

type SelectForm = {
  equipmentDetails: any
  forms: any[]
  onClickForm: (form: any) => void
  userSelectedForm?: any
}

const SelectForm = React.forwardRef((props: SelectForm, ref: any) => {
  const router = useRouter();
  const { equipmentDetails, forms, onClickForm, userSelectedForm } = props;

  useEffect(() => {
    if (userSelectedForm && userSelectedForm.done_reviewing_protocol) {
      router.query.show_protocol = '1';
      router.query.form = userSelectedForm.form_id;
      router.push(router);
    }
  }, [userSelectedForm, router]);

  if (userSelectedForm && userSelectedForm.done_reviewing_protocol) {
    return 'Redirecting...';
  }

  return (
    <div className="py-[30px] w-full" ref={ref}>
      <div className="w-full max-w-[900px] p-5 mx-auto mb-3 text-center flex flex-col gap-1 rounded-xl bg-white shadow-sm">
        <p className="text-xl font-medium mb-2">Item Certification for: </p>
        <p className="text-lg font-medium text-stone-600">{equipmentDetails && equipmentDetails.item_name}</p>
        {equipmentDetails && equipmentDetails.serial_number && (
          <span className="text-lg font-medium text-stone-600">
            {equipmentDetails.serial_number}
          </span>
        )}
        {equipmentDetails && equipmentDetails.item_sub_category_index && equipmentDetails.item_number && (
          <span className="text-lg font-medium text-stone-600">
            {equipmentDetails.item_sub_category_index}{equipmentDetails.item_number}.000
          </span>
        )}
      </div>

      <div className="flex w-full max-w-[900px] gap-2 bg-white p-4 rounded-xl flex-wrap justify-center mx-auto shadow-sm">
        <h1 className="text-xl text-center font-medium flex justify-center py-3 w-full">Please Select Form</h1>
        {forms && forms.map((form: any, key: number) => (
          <button 
            key={key} 
            className="bg-stone-50 hover:bg-stone-200 rounded-xl py-3 px-4 font-medium flex justify-between w-[48%]"
            onClick={() => onClickForm && onClickForm(form)}
          >
            {form.form_description}
            <MoveRight /> 
          </button>
        ))}
      </div>
    </div>
  );
});

SelectForm.displayName = 'SelectForm';

export default SelectForm;