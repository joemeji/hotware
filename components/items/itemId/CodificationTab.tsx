import { Controller, useForm } from "react-hook-form";
import { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { toast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/router";
import { AccessTokenContext } from "@/context/access-token-context";
import { EquipmentContext } from "./Layout";

export function CodificationTab() {
  const { register, handleSubmit, setValue, control } = useForm();
  const [loading, setLoading] = useState(false);
  const equipment: any = useContext(EquipmentContext);
  const router = useRouter();
  const access_token = useContext(AccessTokenContext);

  const onSubmit = async (data: any) => {
    try {
      const payload = { ...data };
      payload.with_serial = payload.with_serial ? 1 : 0;
      setLoading(true);
      const res = await fetch(baseUrl + "/api/items/" + router.query.item_id, {
        method: "PUT",
        body: JSON.stringify(payload),
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
      setValue("item_power", equipment.item_power);
      setValue("item_hertz", equipment.item_hertz);
      setValue("item_pressure", equipment.item_pressure);
      setValue("item_motor_per_min", equipment.item_motor_per_min);
      setValue("item_tension", equipment.item_tension);
      setValue("item_kilowatt", equipment.item_kilowatt);
      setValue("item_construction_year", equipment.item_construction_year);
      setValue("item_manufacturer", equipment.item_manufacturer);
      setValue("item_rated_current", equipment.item_rated_current);
      setValue("with_serial", equipment.with_serial === "1" ? true : false);
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
              Codifications
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">
              Power:{" "}
            </td>
            <td className="py-4">
              <Input
                className=" h-12 border-0 bg-stone-100"
                placeholder="Power"
                {...register("item_power")}
              />
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">
              Hertz:{" "}
            </td>
            <td className="py-4">
              <Input
                className={cn("h-12 border-0 bg-stone-100")}
                placeholder="Hertz"
                {...register("item_hertz")}
              />
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">
              Pressure:{" "}
            </td>
            <td className="py-4">
              <Input
                className=" h-12 border-0 bg-stone-100"
                placeholder="Pressure"
                {...register("item_pressure")}
              />
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">
              Motor U/min:{" "}
            </td>
            <td className="py-4">
              <Input
                className="bg-stone-100 border-0 h-12"
                placeholder="Motor U/min"
                {...register("item_motor_per_min")}
              />
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">
              Tension:{" "}
            </td>
            <td className="py-4">
              <Input
                className="bg-stone-100 border-0 h-12"
                placeholder="Tension"
                {...register("item_tension")}
              />
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">
              Kilowatt:{" "}
            </td>
            <td className="py-4">
              <Input
                className="bg-stone-100 border-0 h-12"
                placeholder="Kilowatt"
                {...register("item_kilowatt")}
              />
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">
              Construction year:{" "}
            </td>
            <td className="py-4">
              <Input
                className="bg-stone-100 border-0 h-12"
                placeholder="Construction year"
                {...register("item_construction_year")}
              />
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">
              Manufacturer:{" "}
            </td>
            <td className="py-4">
              <Input
                className="bg-stone-100 border-0 h-12"
                placeholder="Manufacturer"
                {...register("item_manufacturer")}
              />
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">
              Rated current:{" "}
            </td>
            <td className="py-4">
              <Input
                className="bg-stone-100 border-0 h-12"
                placeholder="Rated current"
                {...register("item_rated_current")}
              />
            </td>
          </tr>
          <tr>
            <td className="py-4 w-[250px] align-top text-stone-500 text-sm">
              With Serial Numbers:{" "}
            </td>
            <td className="py-4">
              <Controller
                control={control}
                name="with_serial"
                render={({ field }) => (
                  <Switch
                    {...field}
                    value={field.value}
                    checked={field.value}
                    onCheckedChange={(checked) => field.onChange(checked)}
                  />
                )}
              />
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
