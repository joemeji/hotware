import { TH } from "@/components/items";

export default function TableHead() {
  return (
    <table className="w-full sticky top-[var(--header-height)] z-10 rounded-sm overflow-hidden">
      <thead>
        <tr>
          <TH className="py-2 bg-stone-300 w-[360px] ps-4">Description</TH>
          <TH className="py-2 bg-stone-300 w-[160px] text-right">HS Code</TH>
          <TH className="py-2 bg-stone-300 w-[130px] text-right">Weight(kg)</TH>
          <TH className="py-2 bg-stone-300 w-[100px] text-right">Qty</TH>
          <TH className="py-2 bg-stone-300 w-[215px] text-right">
            Total Unit Value
          </TH>
          <TH className="py-2 bg-stone-300  ps-10">Status</TH>
        </tr>
      </thead>
    </table>
  );
}
