import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function ReportForm({ formData, formValues, onChangeFormValues }: any) {

  const onChangeInput = (e: any, key1: number, key2: number, name: string) => {
    const _formDataValues = [...formValues];
    if (_formDataValues[key1].form_datas[key2].form_report_data_status === e.target.value) {
      _formDataValues[key1].form_datas[key2].form_report_data_status = null;
    } else {
      _formDataValues[key1].form_datas[key2][name] = e.target.value;
    }
    onChangeFormValues && onChangeFormValues(_formDataValues);
  };

  const formInputValues = (key1: number, key2: number, name: string) => {
    if (
      formValues[key1] 
      && formValues[key1].form_datas 
      && formValues[key1].form_datas[key2] 
      && formValues[key1].form_datas[key2][name]
    ) {
      return formValues[key1].form_datas[key2][name];
    }
    return '';
  };

  return (
    <div className="flex flex-col gap-3">
      {formData && Array.isArray(formData.datas) && formData.datas.map((item: any, key1: number) => (
        <div className="flex flex-col border border-stone-100 rounded-xl overflow-hidden" 
          key={key1}
          ref={item.containerRef}  
        >
          <div className="flex gap-2.5 items-center bg-stone-50 p-2">
            <span className="bg-green-500 text-white w-8 h-8 flex items-center justify-center rounded-full font-medium">
              {key1 + 1}
            </span>
            <span className="text-lg font-medium">{item.form_sub_category_name}</span>
          </div>

          <div className="flex flex-col gap-1">
            {Array.isArray(item.form_datas) && item.form_datas.map((form_data: any, key2: number) => (
              <div className="flex p-2 border-t border-t-stone-100 justify-between items-center" key={key2}>
                <div className="flex flex-col gap-3">
                  <span className="font-medium">{form_data.form_data_name}</span>
                  <div className="flex gap-2">
                    {['ok', 'fail', 'n/a'].map((btn: any, key3: number) => (
                      <label 
                        key={key3} 
                        className={cn(
                          "bg-stone-100 rounded-xl px-3 py-1 flex items-center cursor-pointer",
                          "hover:bg-stone-200",
                          formInputValues(key1, key2, 'form_report_data_status') === btn && 'bg-blue-500 hover:bg-blue-500 text-white'
                        )}
                        htmlFor={`status-${key1}-${key2}-${key3}`}
                      >
                        <input type="radio" value={btn} className="invisible w-0 h-0" 
                          id={`status-${key1}-${key2}-${key3}`}
                          onClick={(e) => onChangeInput(e, key1, key2, 'form_report_data_status')}
                        />
                        <span className="uppercase text-sm">{btn}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <Textarea 
                  className="max-w-[600px] bg-stone-100 border-0 rounded-xl" 
                  placeholder="Remarks (Max of 25 characters)" 
                  value={formInputValues(key1, key2, 'form_report_data_remarks')}
                  onChange={(e) => onChangeInput(e, key1, key2, 'form_report_data_remarks')}
                />
              </div>
            ))}
          </div>

        </div>
      ))}
    </div>
  );
}


export default ReportForm;