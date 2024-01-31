import { memo } from "react";

const Details = ({ renderCurrency, renderDeliveryDate, renderDescription, renderFurnace,renderTypeOfUnit, renderWork }: DetailsProps) => {
  return (
    <>
      <p className="mb-3 font-medium text-base">Details</p>
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-1">
          <label>Description</label>
          {renderDescription}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Currency</label>
          {renderCurrency}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Delivery Date</label>
          {renderDeliveryDate}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Furnace</label>
          {renderFurnace}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Type of Unit</label>
          {renderTypeOfUnit}
        </div>
        <div className="flex flex-col gap-1 w-full">
          <label>Work</label>
          {renderWork}
        </div>
      </div>
    </>
  );
}

export default memo(Details);

type DetailsProps = {
  renderDescription?: React.ReactNode
  renderCurrency?: React.ReactNode
  renderDeliveryDate?: React.ReactNode
  renderFurnace?: React.ReactNode
  renderTypeOfUnit?: React.ReactNode
  renderWork?: React.ReactNode
}