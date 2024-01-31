import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Signature({ placeValue, onChangePlaceValue }: any) {
  const { data: session } = useSession();
  const user: any = session && session.user;

  return (
    <div className="w-full max-w-[600px] p-5 mx-auto border border-stone-100 rounded-xl">
      <div className="mb-3">
        <label className="text-sm mb-1 flex text-stone-400">Inspected By</label>
        <Input 
          className="bg-stone-50 border border-stone-100 text-bold" 
          readOnly
          defaultValue="Joemy Jay Flores"
        />
      </div>
      <div className="mb-3">
        <label className="text-sm mb-1 flex text-stone-400">Place</label>
        <Textarea 
          className="bg-stone-50 border border-stone-100 text-bold" 
          value={placeValue || ''}
          onChange={(e: any) => onChangePlaceValue && onChangePlaceValue(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="text-sm mb-1 flex text-stone-400">Signature</label>
        <div className="bg-stone-50 rounded-xl p-5 flex justify-center">
          <Image 
            src={"https://app.hotwork.ag/public/images/" + (user && user.signature)}
            height={50}
            width={200}
            alt={user && user.firstname + ' ' + user.lastname + ' Signature'}
          />
        </div>
      </div>
    </div>
  );
}