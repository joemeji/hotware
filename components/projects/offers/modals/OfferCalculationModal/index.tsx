import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useCallback, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
// import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input-label";
import { Button } from "@/components/ui/button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
// import { cn } from "@/lib/utils";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
// import { ShippingDetailsContext } from "@/context/shipping-details-context";
// import { AccessTokenContext } from "@/context/access-token-context";
import useSWR, { useSWRConfig } from "swr";
// import VatSelect from "@/components/app/vat-select";
import { useSession } from "next-auth/react";

const CalculationDefaultValues = {
  oic_service_burner: 0,
  oic_oil_burner: 0,
  oic_engineers: 0,
  oic_hour_rate: 0,
  oic_days: 0,
  oic_day_rate: 0,
  oic_sea_freight_rate: 0,
  oic_sea_freight_ways: 0,
  oic_sea_freight_total: 0,
  oic_trucking_rate: 0,
  oic_trucking_ways: 0,
  oic_trucking_total: 0,
  oic_air_ticket_rate: 0,
  oic_air_ticket_total: 0,
  oic_travel_rate: 0,
  oic_travel_total: 0,
  oic_site_visit_rate: 0,
  oic_site_visit_total: 0,
  oic_rental_car_rate: 0,
  oic_rental_car_total: 0,
  oic_crane_rate: 0,
  oic_documents_rate: 0,
  oic_hotel_rate: 0,
  oic_hotel_rooms: 0,
  oic_hotel_total: 0,
  oic_traveling_days: 0,
  oic_traveling_total: 0,
  oic_installation_days: 0,
  oic_installation_total: 0,
  oic_dismantling_days: 0,
  oic_dismantling_total: 0,
  oic_equipment_rent_day_rate: 0,
  oic_equipment_rent_total: 0,
  oic_equipment_maintenance_day_rate: 0,
  oic_equipment_maintenance_total: 0,
  oic_equipment_packing_day_rate: 0,
  oic_equipment_packing_total: 0,
  oic_total: 0,
  oic_liability_insurance_percentage: 0,
  oic_liability_insurance_total: 0,
  oic_hotwork_share_percentage: 0,
  oic_hotwork_share_total: 0,
  oic_profit_percentage: 0,
  oic_profit_total: 0,
  oic_offer_price: 0,
  oic_waiting_time_for_two_years: 0,
  oic_waiting_time_total: 0,
};

function OfferCalculationModal(props: OfferCalculationModalProps) {
  const { data: session }: any = useSession();
  const {
    open,
    onOpenChange,
    offer_item_id,
    onAdded,
    currency,
    offer_id,
    editable,
  } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate } = useSWRConfig();

  const { data: calculation } = useSWR(
    [
      offer_item_id
        ? `/api/projects/offers/items/calculation/${offer_item_id}`
        : undefined,
      session?.user?.access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const yupSchema = yup.object({
    oic_service_burner: yup.number(),
    oic_oil_burner: yup.number(),
    oic_engineers: yup.number(),
    oic_hour_rate: yup.number(),
    oic_days: yup.number().required(),
    oic_day_rate: yup.number(),
    oic_sea_freight_rate: yup.number(),
    oic_sea_freight_ways: yup.number(),
    oic_sea_freight_total: yup.number(),
    oic_trucking_rate: yup.number(),
    oic_trucking_ways: yup.number(),
    oic_trucking_total: yup.number(),
    oic_air_ticket_rate: yup.number(),
    oic_air_ticket_total: yup.number(),
    oic_travel_rate: yup.number(),
    oic_travel_total: yup.number(),
    oic_site_visit_rate: yup.number(),
    oic_site_visit_total: yup.number(),
    oic_rental_car_rate: yup.number(),
    oic_rental_car_total: yup.number(),
    oic_crane_rate: yup.number(),
    oic_documents_rate: yup.number(),
    oic_hotel_rate: yup.number(),
    oic_hotel_rooms: yup.number(),
    oic_hotel_total: yup.number(),
    oic_traveling_days: yup.number(),
    oic_traveling_total: yup.number(),
    oic_installation_days: yup.number(),
    oic_installation_total: yup.number(),
    oic_dismantling_days: yup.number(),
    oic_dismantling_total: yup.number(),
    oic_equipment_rent_day_rate: yup.number(),
    oic_equipment_rent_total: yup.number(),
    oic_equipment_maintenance_day_rate: yup.number(),
    oic_equipment_maintenance_total: yup.number(),
    oic_equipment_packing_day_rate: yup.number(),
    oic_equipment_packing_total: yup.number(),
    oic_total: yup.number(),
    oic_liability_insurance_percentage: yup.number(),
    oic_liability_insurance_total: yup.number(),
    oic_hotwork_share_percentage: yup.number(),
    oic_hotwork_share_total: yup.number(),
    oic_profit_percentage: yup.number(),
    oic_profit_total: yup.number(),
    oic_offer_price: yup.number(),
    oic_waiting_time_for_two_years: yup.number(),
    oic_waiting_time_total: yup.number(),
  });

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
    watch,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: CalculationDefaultValues,
  });
  const data = watch();

  const totalSets =
    Number(data.oic_service_burner) + Number(data.oic_oil_burner);
  const seaFreightTotal = Math.round(
    Number(data.oic_sea_freight_rate) * Number(data.oic_sea_freight_ways)
  );
  const truckingTotal = Math.round(
    Number(data.oic_trucking_rate) * Number(data.oic_trucking_ways)
  );
  const airTicketTotal = Math.round(
    Number(data.oic_engineers) * Number(data.oic_air_ticket_rate)
  );
  const travelTotal = Math.round(
    Number(data.oic_engineers) * Number(data.oic_travel_rate)
  );
  const rentalCarTotal = Math.round(
    (Number(data.oic_days) +
      Number(data.oic_installation_days) +
      Number(data.oic_dismantling_days)) *
      Number(data.oic_rental_car_rate)
  );
  const hotelTotal = Math.round(
    (Number(data.oic_days) +
      Number(data.oic_installation_days) +
      Number(data.oic_dismantling_days)) *
      Number(data.oic_hotel_rate) *
      Number(data.oic_hotel_rooms)
  );
  const travelingTotal = Math.round(
    Number(data.oic_engineers) *
      Number(data.oic_traveling_days) *
      Number(data.oic_day_rate)
  );
  const installationTotal = Math.round(
    Number(data.oic_engineers) *
      Number(data.oic_installation_days) *
      Number(data.oic_day_rate)
  );
  const dismantlingTotal = Math.round(
    Number(data.oic_engineers) *
      Number(data.oic_dismantling_days) *
      Number(data.oic_day_rate)
  );
  const equipmentRentTotal = Math.round(
    totalSets * Number(data.oic_days) * Number(data.oic_equipment_rent_day_rate)
  );
  const equipmentMaintenanceTotal = Math.round(
    totalSets *
      Number(data.oic_days) *
      Number(data.oic_equipment_maintenance_day_rate)
  );
  const equipmentPackingTotal = Math.round(
    totalSets * Number(data.oic_equipment_packing_day_rate)
  );
  const manPowerTotal = Math.round(
    Number(data.oic_engineers) *
      Number(data.oic_days) *
      Number(data.oic_day_rate)
  );
  const total =
    seaFreightTotal +
    truckingTotal +
    airTicketTotal +
    travelTotal +
    Math.round(Number(data.oic_site_visit_rate)) +
    rentalCarTotal +
    Math.round(Number(data.oic_crane_rate)) +
    Math.round(Number(data.oic_documents_rate)) +
    hotelTotal +
    travelingTotal +
    installationTotal +
    dismantlingTotal +
    equipmentRentTotal +
    equipmentMaintenanceTotal +
    equipmentPackingTotal +
    manPowerTotal;
  const liabilityInsuranceTotal = Math.round(
    total * (Number(data.oic_liability_insurance_percentage) / 100)
  );
  const hotworkShareTotal = Math.round(
    total * (Number(data.oic_hotwork_share_percentage) / 100)
  );
  const profitTotal = Math.round(
    total * (Number(data.oic_profit_percentage) / 100)
  );
  const waitingTimeTotal = Math.round(
    totalSets * Number(data.oic_equipment_rent_day_rate) +
      Number(data.oic_engineers) * Number(data.oic_day_rate)
  );
  const waitingTimeForTwoYears = Math.round(waitingTimeTotal / 24);
  const offerPrice = Number(
    total + liabilityInsuranceTotal + hotworkShareTotal + profitTotal
  );

  const onSubmitEditForm = async (formData: any) => {
    if (!editable) return;
    if (Object.keys(errors).length > 0) return;
    try {
      setIsSubmitting(true);
      const options = {
        method: "POST",
        headers: { ...authHeaders(session?.user?.access_token) },
        body: JSON.stringify({ calculations: formData }),
      };
      const res = await fetch(
        baseUrl + `/api/projects/offers/items/calculation/${offer_item_id}`,
        options
      );
      const json = await res.json();
      setIsSubmitting(false);
      onOpenChange && onOpenChange(false);
      if (json.success) {
        onAdded && onAdded(json.items[0]);
        mutate([
          `/api/projects/offers/items/${offer_id}`,
          session?.user?.access_token,
        ]);
        onReset();
      }
    } catch (err: any) {
      setIsSubmitting(false);
    }
  };

  const onReset = useCallback(() => {
    clearErrors();
    reset(CalculationDefaultValues);
  }, [clearErrors, reset]);

  useEffect(() => {
    if (!open) clearErrors();
  }, [open, clearErrors]);

  useEffect(() => {
    if (calculation?.calculation) {
      calculation.calculation.oic_engineers =
        calculation.calculation.oic_engineer;
      reset(calculation?.calculation);
    } else {
      onReset();
    }
  }, [calculation, reset, onReset]);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(open) =>
          !isSubmitting && onOpenChange && onOpenChange(open)
        }
      >
        <DialogContent className="max-w-[900px] p-0 overflow-auto gap-0">
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-background z-10">
            <DialogTitle>Offer Calculation</DialogTitle>
            <DialogPrimitive.Close
              disabled={isSubmitting}
              className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200"
            >
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmitEditForm)}>
            <div className="grid grid-cols-12 p-3 gap-x-5 gap-y-2">
              <div className="col-span-3">
                <label>Service Burner</label>
                <Input
                  className="border-0"
                  label="Sets"
                  error={errors && (errors.oic_service_burner ? true : false)}
                  {...register("oic_service_burner")}
                />
              </div>
              <div className="col-span-3">
                <label>Oil Burner</label>
                <Input
                  className="border-0"
                  label="Sets"
                  error={errors && (errors.oic_oil_burner ? true : false)}
                  {...register("oic_oil_burner")}
                />
              </div>
              <div className="col-span-3"></div>
              <div className="col-span-3">
                {editable ? (
                  <Button type="button" onClick={onReset}>
                    Clear all fields
                  </Button>
                ) : null}
              </div>
              <div className="col-span-3">
                <label>Engineers</label>
                <Input
                  className="border-0"
                  label="Eng."
                  error={errors && (errors.oic_engineers ? true : false)}
                  {...register("oic_engineers")}
                />
              </div>
              <div className="col-span-3">
                <label>Hour Rate</label>
                <Input
                  type="number"
                  className="border-0"
                  label={currency}
                  min="0"
                  step="0.01"
                  list="hour_rate_list"
                  error={errors && (errors.oic_hour_rate ? true : false)}
                  {...register("oic_hour_rate")}
                />
                <datalist id="hour_rate_list">
                  <option value="0" />
                  <option value="5" />
                  <option value="10" />
                  <option value="15" />
                  <option value="20" />
                  <option value="25" />
                  <option value="30" />
                  <option value="35" />
                </datalist>
              </div>
              <div className="col-span-3"></div>
              <div className="col-span-3 text-xl flex items-end">
                Offer Price:
              </div>
              <div className="col-span-3">
                <label>Working Days</label>
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  error={errors && (errors.oic_days ? true : false)}
                  {...register("oic_days")}
                  label="Days"
                />
              </div>
              <div className="col-span-3">
                <label>Day Rate</label>
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  error={errors && (errors.oic_day_rate ? true : false)}
                  {...register("oic_day_rate")}
                  label={currency}
                />
              </div>
              <div className="col-span-3"></div>
              <div className="col-span-3 text-2xl flex items-center">
                <div className="p-2 bg-red-200">
                  {currency} {offerPrice.toFixed(2)}
                </div>
              </div>
              <div className="col-span-12 text-lg">Transport Cost</div>
              <div className="col-span-2 flex items-center">Sea Freight</div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  step="0.01"
                  error={errors && (errors.oic_sea_freight_rate ? true : false)}
                  {...register("oic_sea_freight_rate")}
                  label={currency}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  error={errors && (errors.oic_sea_freight_ways ? true : false)}
                  {...register("oic_sea_freight_ways")}
                  label="ways"
                />
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_sea_freight_total")}
                  label={currency}
                  value={seaFreightTotal}
                />
              </div>
              <div className="col-span-2 flex items-center">Trucking</div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  step="0.01"
                  error={errors && (errors.oic_trucking_rate ? true : false)}
                  {...register("oic_trucking_rate")}
                  label={currency}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  error={errors && (errors.oic_trucking_ways ? true : false)}
                  {...register("oic_trucking_ways")}
                  label="ways"
                />
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_trucking_total")}
                  label={currency}
                  value={truckingTotal}
                />
              </div>
              <div className="col-span-2 flex items-center">Air Tickets</div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  step="0.01"
                  error={errors && (errors.oic_air_ticket_rate ? true : false)}
                  {...register("oic_air_ticket_rate")}
                  label={currency}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label="Eng."
                  value={data.oic_engineers}
                />
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_air_ticket_total")}
                  label={currency}
                  value={airTicketTotal}
                />
              </div>
              <div className="col-span-2 flex items-center">Travel</div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  step="0.01"
                  error={errors && (errors.oic_travel_rate ? true : false)}
                  {...register("oic_travel_rate")}
                  label={currency}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label="Eng."
                  value={data.oic_engineers}
                />
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_travel_total")}
                  label={currency}
                  value={travelTotal}
                />
              </div>
              <div className="col-span-2 flex items-center">Site Visit</div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  step="0.01"
                  error={errors && (errors.oic_site_visit_rate ? true : false)}
                  {...register("oic_site_visit_rate")}
                  label={currency}
                />
              </div>
              <div className="col-span-3"></div>
              <div className="col-span-1"></div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_site_visit_total")}
                  label={currency}
                  value={Math.round(Number(data.oic_site_visit_rate)) || 0}
                />
              </div>
              <div className="col-span-2 flex items-center">Rental Car</div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  step="0.01"
                  error={errors && (errors.oic_rental_car_rate ? true : false)}
                  {...register("oic_rental_car_rate")}
                  label={currency}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label="Days"
                  value={
                    Number(data.oic_days) +
                    Number(data.oic_installation_days) +
                    Number(data.oic_dismantling_days)
                  }
                />
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_rental_car_total")}
                  label={currency}
                  value={rentalCarTotal}
                />
              </div>
              <div className="col-span-12 text-lg">Other Costs</div>
              <div className="col-span-2 flex items-center">Crane</div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  step="0.01"
                  error={errors && (errors.oic_crane_rate ? true : false)}
                  {...register("oic_crane_rate")}
                  label={currency}
                />
              </div>
              <div className="col-span-3"></div>
              <div className="col-span-1"></div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label={currency}
                  value={Math.round(Number(data.oic_crane_rate))}
                />
              </div>
              <div className="col-span-2 flex items-center">Documents</div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  step="0.01"
                  error={errors && (errors.oic_documents_rate ? true : false)}
                  {...register("oic_documents_rate")}
                  label={currency}
                />
              </div>
              <div className="col-span-3"></div>
              <div className="col-span-1"></div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label={currency}
                  value={Math.round(Number(data.oic_documents_rate))}
                />
              </div>
              <div className="col-span-2 flex items-center">Hotel</div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  step="0.01"
                  error={errors && (errors.oic_hotel_rate ? true : false)}
                  {...register("oic_hotel_rate")}
                  label={currency}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  error={errors && (errors.oic_hotel_rooms ? true : false)}
                  {...register("oic_hotel_rooms")}
                  label="Rooms"
                />
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_hotel_total")}
                  label={currency}
                  value={hotelTotal}
                />
              </div>
              <div className="col-span-5 text-lg">Traveling</div>
              <div className="col-span-7 flex items-end">Day Rate</div>
              <div className="col-span-2 flex items-center">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label="Eng."
                  value={data.oic_engineers}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  error={errors && (errors.oic_traveling_days ? true : false)}
                  {...register("oic_traveling_days")}
                  label="Days"
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label={currency}
                  value={data.oic_day_rate}
                />
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_traveling_total")}
                  label={currency}
                  value={travelingTotal}
                />
              </div>
              <div className="col-span-5 text-lg">Installation</div>
              <div className="col-span-7 flex items-end">Day Rate</div>
              <div className="col-span-2 flex items-center">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label="Eng."
                  value={data.oic_engineers}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  error={
                    errors && (errors.oic_installation_days ? true : false)
                  }
                  {...register("oic_installation_days")}
                  label="Days"
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label={currency}
                  value={data.oic_day_rate}
                />
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_installation_total")}
                  label={currency}
                  value={installationTotal}
                />
              </div>
              <div className="col-span-5 text-lg">Dismantling</div>
              <div className="col-span-7 flex items-end">Day Rate</div>
              <div className="col-span-2 flex items-center">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label="Eng."
                  value={data.oic_engineers}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  error={errors && (errors.oic_dismantling_days ? true : false)}
                  {...register("oic_dismantling_days")}
                  label="Days"
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label={currency}
                  value={data.oic_day_rate}
                />
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_dismantling_total")}
                  label={currency}
                  value={dismantlingTotal}
                />
              </div>
              <div className="col-span-5 text-lg">Equipment Rent</div>
              <div className="col-span-7 flex items-end">Day Rate</div>
              <div className="col-span-2 flex items-center">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label="Sets"
                  value={
                    Number(data.oic_service_burner) +
                      Number(data.oic_oil_burner) || 0
                  }
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label="Days"
                  value={data.oic_days}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  error={
                    errors &&
                    (errors.oic_equipment_rent_day_rate ? true : false)
                  }
                  {...register("oic_equipment_rent_day_rate")}
                  label={currency}
                  list="equipment_rent_rate_list"
                />
                <datalist id="equipment_rent_rate_list">
                  <option value="0" />
                  <option value="8" />
                  <option value="25" />
                  <option value="35" />
                  <option value="50" />
                  <option value="60" />
                  <option value="75" />
                  <option value="90" />
                  <option value="100" />
                  <option value="200" />
                  <option value="800" />
                  <option value="1000" />
                </datalist>
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_equipment_rent_total")}
                  label={currency}
                  value={equipmentRentTotal}
                />
              </div>
              <div className="col-span-12 text-lg">Equipment Maintenance</div>
              <div className="col-span-2 flex items-center">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label="Sets"
                  value={
                    Number(data.oic_service_burner) +
                      Number(data.oic_oil_burner) || 0
                  }
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label="Days"
                  value={data.oic_days}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  error={
                    errors &&
                    (errors.oic_equipment_maintenance_day_rate ? true : false)
                  }
                  {...register("oic_equipment_maintenance_day_rate")}
                  label={currency}
                  list="equipment_maintenance_rate_list"
                />
                <datalist id="equipment_maintenance_rate_list">
                  <option value="25" />
                  <option value="30" />
                  <option value="35" />
                  <option value="40" />
                  <option value="45" />
                  <option value="50" />
                  <option value="55" />
                  <option value="60" />
                  <option value="65" />
                  <option value="70" />
                  <option value="75" />
                  <option value="90" />
                  <option value="100" />
                  <option value="110" />
                  <option value="120" />
                  <option value="130" />
                  <option value="140" />
                  <option value="150" />
                </datalist>
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_equipment_maintenance_total")}
                  label={currency}
                  value={equipmentMaintenanceTotal}
                />
              </div>
              <div className="col-span-12 text-lg">Equipment Packing</div>
              <div className="col-span-2 flex items-center">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label="Sets"
                  value={
                    Number(data.oic_service_burner) +
                      Number(data.oic_oil_burner) || 0
                  }
                />
              </div>
              <div className="col-span-3"></div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  error={
                    errors &&
                    (errors.oic_equipment_packing_day_rate ? true : false)
                  }
                  {...register("oic_equipment_packing_day_rate")}
                  label={currency}
                  list="equipment_packing_rate_list"
                />
                <datalist id="equipment_packing_rate_list">
                  <option value="25" />
                  <option value="30" />
                  <option value="35" />
                  <option value="40" />
                  <option value="45" />
                  <option value="50" />
                  <option value="55" />
                  <option value="60" />
                  <option value="65" />
                  <option value="70" />
                  <option value="75" />
                  <option value="90" />
                  <option value="100" />
                  <option value="110" />
                  <option value="120" />
                  <option value="130" />
                  <option value="140" />
                  <option value="150" />
                </datalist>
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_equipment_packing_total")}
                  label={currency}
                  value={equipmentPackingTotal}
                />
              </div>
              <div className="col-span-12 text-lg">Manpower</div>
              <div className="col-span-2 flex items-center">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label="Eng."
                  value={data.oic_engineers}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label="Days"
                  value={data.oic_days}
                />
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label={currency}
                  value={data.oic_day_rate}
                />
              </div>
              <div className="col-span-1"></div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label={currency}
                  value={manPowerTotal}
                />
              </div>
              <div className="col-span-12 my-5">
                <hr />
              </div>
              <div className="col-span-4"></div>
              <div className="col-span-2"></div>
              <div className="col-span-3 text-lg flex items-center justify-end">
                Total
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  label={currency}
                  value={total}
                />
              </div>
              <div className="col-span-4"></div>
              <div className="col-span-2">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  error={
                    errors &&
                    (errors.oic_liability_insurance_percentage ? true : false)
                  }
                  {...register("oic_liability_insurance_percentage")}
                  label="%"
                />
              </div>
              <div className="col-span-3 text-lg flex items-center justify-end">
                Liability Insurance
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_liability_insurance_total")}
                  label={currency}
                  value={liabilityInsuranceTotal.toFixed(2)}
                />
              </div>
              <div className="col-span-4"></div>
              <div className="col-span-2">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  error={
                    errors &&
                    (errors.oic_hotwork_share_percentage ? true : false)
                  }
                  {...register("oic_hotwork_share_percentage")}
                  label="%"
                />
              </div>
              <div className="col-span-3 text-lg flex items-center justify-end">
                Commisions %
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_hotwork_share_total")}
                  label={currency}
                  value={hotworkShareTotal.toFixed(2)}
                />
              </div>
              <div className="col-span-4"></div>
              <div className="col-span-2">
                <Input
                  type="number"
                  className="border-0"
                  min="0"
                  error={
                    errors && (errors.oic_profit_percentage ? true : false)
                  }
                  {...register("oic_profit_percentage")}
                  label="%"
                />
              </div>
              <div className="col-span-3 text-lg flex items-center justify-end">
                Profit %
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_profit_total")}
                  label={currency}
                  value={profitTotal.toFixed(2)}
                />
              </div>
              <div className="col-span-4"></div>
              <div className="col-span-2"></div>
              <div className="col-span-3 text-lg flex items-center justify-end">
                OFFER PRICE
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_offer_price")}
                  label={currency}
                  value={offerPrice.toFixed(2)}
                />
              </div>
              <div className="col-span-4"></div>
              <div className="col-span-2">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_waiting_time_for_two_years")}
                  label={currency}
                  value={waitingTimeForTwoYears.toFixed(2)}
                />
              </div>
              <div className="col-span-3 text-lg flex items-center justify-end">
                Waiting Time
              </div>
              <div className="col-span-3">
                <Input
                  type="number"
                  className="border-0"
                  disabled={true}
                  {...register("oic_waiting_time_total")}
                  label={currency}
                  value={waitingTimeTotal}
                />
              </div>
            </div>

            <DialogFooter className="p-3">
              {editable ? (
                <Button type="submit" disabled={isSubmitting}>
                  Save
                </Button>
              ) : null}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(OfferCalculationModal);

type OfferCalculationModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  offer_id: string;
  offer_item_id: any;
  currency: string;
  onAdded?: (updatedItem?: any) => void;
  editable: boolean;
};
