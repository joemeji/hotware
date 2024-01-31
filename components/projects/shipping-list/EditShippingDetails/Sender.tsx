import WarehouseSelect from "@/components/app/warehouse-select"
import ContactPersonSelect from "./ContactPersonSelect"
import { memo } from "react"

const Sender = ({ value, onChangeValue, renderContactForm, error }: SenderProps) => {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-3 font-medium text-base">Sender:</p>
        <div>
          <p className="mb-1">Warehouse</p>
          <WarehouseSelect 
            value={value}
            onChangeValue={onChangeValue}
            error={error}
          />
        </div>
      </div>
      <div>
        <p className="mb-1">Contact Person</p>
        {renderContactForm}
      </div>
    </div>
  );
};

export function SenderContactForm({ value, onChangeValue }: ChildFormProps) {
  return (
    <ContactPersonSelect 
      value={value}
      onChangeValue={onChangeValue}
    />
  );
}

type ChildFormProps = {
  onChangeValue?: (id?: any) => void
  value?: any
}

type SenderProps = {
  value?: any
  onChangeValue?: (value?: any) => void
  renderContactForm?: React.ReactNode
  error?: any
}

export default memo(Sender);