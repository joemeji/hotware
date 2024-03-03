import { Controller, FieldErrors, useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import unitTypes from "@/utils/unitTypes";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { AccessTokenContext } from "@/context/access-token-context";
import { EquipmentContext } from "./Layout";

const yupSchema = yup.object({
  item_length: yup
    .number()
    .nullable()
    .positive("Item Length must be a positive number")
    .typeError("Item Length must be a number"),
  item_weight: yup
    .number()
    .nullable()
    .positive("Item Weight must be a positive number")
    .typeError("Item Weight must be a number"),
  item_height: yup
    .number()
    .nullable()
    .positive("Item Height must be a positive number")
    .typeError("Item Height must be a number"),
  item_width: yup
    .number()
    .nullable()
    .positive("Item Width must be a positive number")
    .typeError("Item Width must be a number"),
  item_hs_code: yup.mixed().nullable(),
  item_origin: yup.mixed().nullable(),
  item_unit: yup.mixed(),
});

export function UnitsTab() {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    control,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      item_length: 0,
      item_weight: 0,
      item_height: 0,
      item_width: 0,
    },
  });
  const [loading, setLoading] = useState(false);
  const _errors: FieldErrors | any = errors;
  const equipment: any = useContext(EquipmentContext);
  const router = useRouter();
  const access_token = useContext(AccessTokenContext);

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const res = await fetch(baseUrl + "/api/items/" + router.query.item_id, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { ...authHeaders(access_token) },
      });
      const json = await res.json();

      if (json && json.success) {
        setLoading(false);
        toast({
          title: "Successfully updated.",
          variant: "success",
          duration: 4000,
        });
      }
    } catch (err: any) {
      setLoading(false);
      console.log("Error: " + err.message);
      toast({
        title: "Internal Server Error",
        description:
          "The server encountered an error and could not complete your request.",
        variant: "destructive",
        duration: 10000,
      });
    }
  };

  useEffect(() => {
    if (equipment) {
      setValue("item_length", equipment.item_length);
      setValue("item_weight", equipment.item_weight);
      setValue("item_height", equipment.item_height);
      setValue("item_width", equipment.item_width);
      setValue("item_hs_code", equipment.item_hs_code);
      setValue("item_origin", equipment.item_origin);
      setValue("item_unit", equipment.item_unit);
    }
  }, [equipment, setValue]);

  return (
    <form
      className="rounded-xl px-5 py-6 bg-white shadow-sm"
      onSubmit={handleSubmit(onSubmit)}
    >
      <table className="w-full">
        <tbody>
          <tr>
            <td colSpan={2} className="border-b font-medium text-lg">
              Measurement Units
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">
              Length (mm):{" "}
            </td>
            <td className="py-4">
              <Input
                className=" h-12 border-0 bg-stone-100"
                placeholder="Length"
                {...register("item_length")}
                error={_errors && (_errors.item_length ? true : false)}
              />
              <span className="text-red-400 text-sm mt-1 flex">
                {_errors && _errors.item_length?.message}
              </span>
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">
              Width (mm):{" "}
            </td>
            <td className="py-4">
              <Input
                className={cn("h-12 border-0 bg-stone-100")}
                placeholder="Width"
                {...register("item_width")}
                error={_errors && (_errors.item_width ? true : false)}
              />
              <span className="text-red-400 text-sm mt-1 flex">
                {_errors && _errors.item_width?.message}
              </span>
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">
              Height (mm):{" "}
            </td>
            <td className="py-4">
              <Input
                className=" h-12 border-0 bg-stone-100"
                placeholder="Height"
                {...register("item_height")}
                error={_errors && (_errors.item_height ? true : false)}
              />
              <span className="text-red-400 text-sm mt-1 flex">
                {_errors && _errors.item_height?.message}
              </span>
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">
              Weight (kg):{" "}
            </td>
            <td className="py-4">
              <Input
                className="bg-stone-100 border-0 h-12"
                placeholder="Weight"
                {...register("item_weight")}
                error={_errors && (_errors.item_weight ? true : false)}
              />
              <span className="text-red-400 text-sm mt-1 flex">
                {_errors && _errors.item_weight?.message}
              </span>
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">
              Type:{" "}
            </td>
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
                    <SelectTrigger className="bg-stone-100 border-0 h-11 w-full text-left">
                      <SelectValue
                        placeholder="Select a type"
                        className="bg-stone-100 "
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {unitTypes.map((unitType: string, key: number) => (
                        <SelectItem
                          value={unitType}
                          key={key}
                          className="cursor-pointer"
                        >
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
            <td colSpan={2} className="border-b font-medium text-lg">
              Customs Tariff Number / Country of Origin
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">
              HS Code:{" "}
            </td>
            <td className="py-4">
              <Input
                className=" h-12 border-0 bg-stone-100"
                placeholder="HS Code"
                {...register("item_hs_code")}
              />
              <span className="text-red-400 text-sm mt-1 flex">
                {_errors && _errors.item_hs_code?.message}
              </span>
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">
              Country of Origin:{" "}
            </td>
            <td className="py-4">
              <Input
                className={cn("h-12 border-0 bg-stone-100")}
                placeholder="Country of Origin"
                {...register("item_origin")}
              />
              <span className="text-red-400 text-sm mt-1 flex">
                {_errors && _errors.item_origin?.message}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="pt-4 border-t text-right">
        <Button
          disabled={loading}
          type="submit"
          className={loading ? "loading" : ""}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
