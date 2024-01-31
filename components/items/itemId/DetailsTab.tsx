import { useSession } from "next-auth/react";
import { FieldErrors, useForm } from "react-hook-form";
import { TabType } from ".";
import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { toast } from "@/components/ui/use-toast";

interface DetailsTabType extends TabType {
  equipment?: any
}

export function DetailsTab(props: DetailsTabType) {
  const { data: session }: { data: any } = useSession();
  let token: any = null;
  const { _item_id, equipment, onUpdated } = props;
  const { register, formState: { errors }, handleSubmit, setValue } = useForm();
  const [loading, setLoading] = useState(false);

  if (session && session.user && session.user.access_token) {
    token = session?.user.access_token;
  }

  const _errors: FieldErrors | any = errors;

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const res = await fetch(baseUrl + '/api/items/' + _item_id, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: { ...authHeaders(token) }
      });
      const json = await res.json();

      if (json && json.success) {
        setLoading(false);
        toast({
          title: "Successfully updated.",
          variant: 'success',
          duration: 4000
        });
        onUpdated && onUpdated(data);
      }
    }
    catch(err: any) {
      setLoading(false);
      console.log('Error: ' + err.message);
      toast({
        title: "Internal Server Error",
        description: 'The server encountered an error and could not complete your request.',
        variant: 'destructive',
        duration: 10000
      });
    }
  };

  console.log(equipment)

  useEffect(() => {
    setValue('item_number', equipment && (equipment.item_sub_category_index + equipment.item_number));
    setValue('item_account', equipment && equipment.item_account && equipment.item_account.item_account_number);
    setValue('item_name', equipment && equipment.item_name);
    setValue('item_description', equipment && equipment.item_description);
    setValue('item_additional_text', equipment && equipment.item_additional_text);
    setValue('item_offer_text', equipment && equipment.item_offer_text);
    setValue('item_purchase_order_text', equipment && equipment.item_purchase_order_text);
  }, [equipment, setValue]);

  return (
    <form className="rounded-xl px-5 py-6 bg-white shadow-sm" onSubmit={handleSubmit(onSubmit)}>
      <table className="w-full">
        <tbody>
          <tr>
            <td colSpan={2} className="border-b font-medium text-lg">Details</td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">Article Number: </td>
            <td className="py-4">
              <Input className=" h-12 border-0 bg-stone-100" 
                placeholder="Article Number"
                {...register('item_number')}
                readOnly
              />
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">Item Name: </td>
            <td className="py-4">
              <Input 
                className={cn("h-12 border-0 bg-stone-100")} 
                error={_errors && (_errors.item_name ? true : false)}
                placeholder="Item Name"
                {...register('item_name', { required: 'Item Name is required.' })}
              />
              <span className="text-red-400 text-sm mt-1 flex">
                {_errors && _errors.item_name?.message}
              </span>
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">Account Number: </td>
            <td className="py-4">
              <Input className=" h-12 border-0 bg-stone-100" 
                placeholder="Account Number"
                {...register('item_account')}
              />
            </td>
          </tr> 
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">Item Description: </td>
            <td className="py-4">
              <Textarea className="bg-stone-100 border-0" 
                placeholder="Item Description"
                {...register('item_description')}
            />
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">Alternative Text: </td>
            <td className="py-4">
              <Textarea className="bg-stone-100 border-0" 
                placeholder="Alternative Text"
                {...register('item_additional_text')}
              />
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">Offer Text: </td>
            <td className="py-4">
              <Textarea className="bg-stone-100 border-0" 
                placeholder="Offer Text"
                {...register('item_offer_text')}
              />
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">Purchase Order Text: </td>
            <td className="py-4">
              <Textarea className="bg-stone-100 border-0" 
                placeholder="Purchase Order Text"
                {...register('item_purchase_order_text')}
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="pt-4 border-t text-right">
        <Button 
          disabled={loading}
          type="submit"
          className={loading ? 'loading' : ''}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );

}