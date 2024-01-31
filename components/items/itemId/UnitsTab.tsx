import { useSession } from "next-auth/react";
import { Controller, FieldErrors, useForm } from "react-hook-form";
import { TabType } from ".";
import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import unitTypes from "@/utils/unitTypes";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

interface DetailsTabType extends TabType {
  equipment?: any,
}

const yupSchema = yup.object({
  item_length: yup.number().positive('Item Length must be a positive number').typeError('Item Length must be a number'),
  item_weight: yup.number().positive('Item Weight must be a positive number').typeError('Item Weight must be a number'),
  item_height: yup.number().positive('Item Height must be a positive number').typeError('Item Height must be a number'),
  item_width: yup.number().positive('Item Width must be a positive number').typeError('Item Width must be a number'),
  item_hs_code: yup.mixed(),
  item_origin: yup.mixed(),
  item_unit: yup.mixed(),
});

export function UnitsTab(props: DetailsTabType) {
  const { data: session }: { data: any } = useSession();
  let token: any = null;
  const { _item_id, equipment, onUpdated } = props;
  const { 
    register, 
    formState: { errors }, 
    handleSubmit, 
    setValue, 
    control, 
  } = useForm({
    resolver: yupResolver(yupSchema)
  });
  const [loading, setLoading] = useState(false);
  const _errors: FieldErrors | any = errors;

  if (session && session.user && session.user.access_token) {
    token = session?.user.access_token;
  }

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

  useEffect(() => {
    setValue('item_length', equipment && equipment.item_length);
    setValue('item_weight', equipment && equipment.item_weight);
    setValue('item_height', equipment && equipment.item_height);
    setValue('item_width', equipment && equipment.item_width);
    setValue('item_hs_code', equipment && equipment.item_hs_code);
    setValue('item_origin', equipment && equipment.item_origin);
    setValue('item_unit', equipment && equipment.item_unit);
  }, [equipment, setValue]);

  return (
    <form className="rounded-xl px-5 py-6 bg-white shadow-sm" onSubmit={handleSubmit(onSubmit)}>
      <table className="w-full">
        <tbody>
          <tr>
            <td colSpan={2} className="border-b font-medium text-lg">Measurement Units</td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">Length (mm): </td>
            <td className="py-4">
              <Input className=" h-12 border-0 bg-stone-100" 
                placeholder="Length"
                {...register('item_length')}
                error={_errors && (_errors.item_length ? true : false)}
              />
              <span className="text-red-400 text-sm mt-1 flex">
                {_errors && _errors.item_length?.message}
              </span>
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">Width (mm): </td>
            <td className="py-4">
              <Input 
                className={cn("h-12 border-0 bg-stone-100")} 
                placeholder="Width"
                {...register('item_width')}
                error={_errors && (_errors.item_width ? true : false)}
              />
                <span className="text-red-400 text-sm mt-1 flex">
                  {_errors && _errors.item_width?.message}
                </span>
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">Height (mm): </td>
            <td className="py-4">
              <Input className=" h-12 border-0 bg-stone-100" 
                placeholder="Height"
                {...register('item_height')}
                error={_errors && (_errors.item_height ? true : false)}
              />
              <span className="text-red-400 text-sm mt-1 flex">
                {_errors && _errors.item_height?.message}
              </span>
            </td>
          </tr> 
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">Weight (kg): </td>
            <td className="py-4">
              <Input className="bg-stone-100 border-0 h-12" 
                placeholder="Weight"
                {...register('item_weight')}
                error={_errors && (_errors.item_weight ? true : false)}
              />
              <span className="text-red-400 text-sm mt-1 flex">
                {_errors && _errors.item_weight?.message}
              </span>
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">Type: </td>
            <td className="py-4">
              <Controller 
                name="item_unit" 
                control={control}
                render={({ field }) => (
                  <Select 
                    {...field}
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                  >
                    <SelectTrigger className="bg-stone-100 border-0 h-12 w-full">
                      <SelectValue placeholder="Select a fruit" className="bg-stone-100" />
                    </SelectTrigger>
                    <SelectContent>
                      {unitTypes.map((unitType: string, key: number) => (
                        <SelectItem value={unitType} key={key} className="cursor-pointer">
                          {unitType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </td>
          </tr>
        </tbody>
      </table>

      <table className="w-full">
        <tbody>
          <tr>
            <td colSpan={2} className="border-b font-medium text-lg">Customs Tariff Number / Country of Origin</td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">HS Code: </td>
            <td className="py-4">
              <Input className=" h-12 border-0 bg-stone-100" 
                placeholder="HS Code"
                {...register('item_hs_code')}
              />
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">Country of Origin: </td>
            <td className="py-4">
              <Input 
                className={cn("h-12 border-0 bg-stone-100")} 
                placeholder="Country of Origin"
                {...register('item_origin')}
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