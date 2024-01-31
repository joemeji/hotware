import Data from "./Data";
import PurchaseOrder from "./PurchaseOrder";

const AddressSupplier = ({ headerSize }: { headerSize?: any }) => {
  return (
    <div className="flex gap-[10px] mt-[10px]">
      <Data headerSize={headerSize} />

      <PurchaseOrder headerSize={headerSize} />
    </div>
  );
};

export default AddressSupplier;
