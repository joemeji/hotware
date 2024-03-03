import { Button } from "@/components/ui/button";
import { BarChart3, Calculator, LineChart, Plus } from "lucide-react";
import { memo } from "react";

const HeaderButton = (props: HeaderButtonProps) => {
  const { onClickItem } = props;
  return (
    <div className="rounded-xl flex gap-2">
      <Button
        className="flex gap-2 text-stone-600 bg-stone-200 hover:bg-stone-300 px-2 py-2"
        onClick={() => onClickItem && onClickItem("add")}
      >
        <Plus color="green" strokeWidth={2} /> Add Scope
      </Button>
      {/* <Button className="flex gap-2 text-stone-600 bg-stone-200 hover:bg-stone-300 px-2 py-2">
        <LineChart color="red" strokeWidth={2} /> Curve
      </Button> */}
      <Button
        className="flex gap-2 text-stone-600 bg-stone-200 hover:bg-stone-300 px-2 py-2"
        onClick={() => onClickItem && onClickItem("cost-calculation")}
      >
        <Calculator strokeWidth={2} /> Project Cost Calculation
      </Button>
      {/* <Button className="flex gap-2 text-stone-600 bg-stone-200 hover:bg-stone-300 px-2 py-2">
        <BarChart3 color="orange" strokeWidth={2} /> Project Summary
      </Button> */}
    </div>
  );
};

export default memo(HeaderButton);

type HeaderButtonProps = {
  onClickItem?: (event: any) => void;
};
