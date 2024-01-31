import { Check, X } from "lucide-react";

const CompleteIncompleteStatus = ({ completed = false }: { completed: boolean }) => {
  if (completed) {
    return (
      <div className="bg-green-700 p-[3px] w-fit rounded-full">
        <Check width={16} height={16} strokeWidth={4} className="text-white" />
      </div>
    );
  }
  return (
    <div className="bg-red-700 p-[3px] w-fit rounded-full">
      <X width={16} height={16} strokeWidth={4} className="text-white" />
    </div>
  );
}

export default function CompletedMark({ item }: any) {
  let render = null;

  if (!item) {
    render = <CompleteIncompleteStatus completed={false} />;
  }

  if (Number(item.is_custom) === 1) {
    if (Number(item.custom_total_added) === Number(item.shipping_item_quantity)) {
      render = <CompleteIncompleteStatus completed={true} />;
    }
  }

  if (Number(item.with_serial) === 1) {
    if (Number(item.total_added) === Number(item.shipping_item_quantity)) {
      render = <CompleteIncompleteStatus completed={true} />;
    }
  }

  if (Number(item.with_serial) === 0) {
    if (Number(item.unserialized_total_added) === Number(item.shipping_item_quantity)) {
      render = <CompleteIncompleteStatus completed={true} />;
    }
  }

  return (
    <div className="min-w-[150px] p-2 ps-12 flex items-center">
      {render || <CompleteIncompleteStatus completed={false} />}
    </div>
  );
}