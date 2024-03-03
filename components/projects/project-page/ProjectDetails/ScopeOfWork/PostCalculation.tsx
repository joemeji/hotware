import { memo, useCallback, useContext, useEffect, useState } from "react";
import {
  InputLabel,
  InputSuffix,
  InputSuffixPost,
  PostInputLabel,
  SelectSuffix,
} from "./FormElements/InputLabel";
import { Button } from "@/components/ui/button";
import { Eraser, Loader2, Save } from "lucide-react";
import { AccessTokenContext } from "@/context/access-token-context";
import useSWR from "swr";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import * as yup from "yup";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";

const yupObject: any = {
  prcc_service_burners: yup.number().required("This field is required."),
  prcc_oil_burner: yup.number().required("This field is required."),
  prcc_engineer: yup.number().required("This field is required."),
  prcc_days: yup.number().required("This field is required."),
  prcc_hour_rate: yup.number().required("This field is required."),
  prcc_day_rate: yup.number().required("This field is required."),
  prcc_sea_freight_rate: yup.number().required("This field is required."),
  prcc_sea_freight_ways: yup.number().required("This field is required."),
  prcc_sea_freight_total: yup.string(),
  prcc_trucking_rate: yup.number().required("This field is required."),
  prcc_trucking_ways: yup.number().required("This field is required."),
  prcc_trucking_total: yup.string(),
  prcc_air_ticket_rate: yup.number().required("This field is required."),
  prcc_air_ticket_eng: yup.string(),
  prcc_air_ticket_total: yup.string(),
  prcc_travel_rate: yup.number().required("This field is required."),
  prcc_travel_eng: yup.string(),
  prcc_travel_total: yup.string(),
  prcc_site_visit_rate: yup.number().required("This field is required."),
  prcc_site_visit_total: yup.string(),
  prcc_rental_car_rate: yup.number().required("This field is required."),
  prcc_rental_car_days: yup.string(),
  prcc_rental_car_total: yup.string(),
  prcc_crane_rate: yup.number().required("This field is required."),
  prcc_crane_total: yup.string(),
  prcc_documents_rate: yup.number().required("This field is required."),
  prcc_documents_total: yup.string(),
  prcc_hotel_rate: yup.number().required("This field is required."),
  prcc_hotel_rooms: yup.number().required("This field is required."),
  prcc_hotel_total: yup.string(),
  prcc_traveling_days: yup.number().required("This field is required."),
  prcc_traveling_rate: yup.string(),
  prcc_traveling_eng: yup.string(),
  prcc_traveling_total: yup.string(),
  prcc_installation_days: yup.number().required("This field is required."),
  prcc_installation_rate: yup.string(),
  prcc_installation_eng: yup.string(),
  prcc_installation_total: yup.string(),
  prcc_dismantling_days: yup.number().required("This field is required."),
  prcc_dismantling_rate: yup.string(),
  prcc_dismantling_eng: yup.string(),
  prcc_dismantling_total: yup.string(),
  prcc_equipment_rent_day_rate: yup
    .number()
    .required("This field is required."),
  prcc_equipment_rent_day_total: yup.string(),
  prcc_equipment_rent_day_sets: yup.string(),
  prcc_equipment_rent_days: yup.string(),
  prcc_equipment_maintenance_day_rate: yup
    .number()
    .required("This field is required."),
  prcc_equipment_maintenance_day_total: yup.string(),
  prcc_equipment_maintenance_sets: yup.string(),
  prcc_equipment_maintenance_days: yup.string(),
  prcc_equipment_packing_day_rate: yup
    .number()
    .required("This field is required."),
  prcc_equipment_packing_day_sets: yup.string(),
  prcc_equipment_packing_day_total: yup.string(),
  prcc_liability_insurance_percentage: yup
    .number()
    .required("This field is required."),
  prcc_liability_insurance_total: yup.string(),
  prcc_hotwork_share_percentage: yup
    .number()
    .required("This field is required."),
  prcc_hotwork_share_total: yup.string(),
  prcc_profit_percentage: yup.number().required("This field is required."),
  prcc_profit_percentage_total: yup.string(),
  prcc_other_costs: yup.number().required("This field is required."),
  prcc_other_costs_total: yup.string(),
  prcc_man_power: yup.string(),
  prcc_man_power_days: yup.string(),
  prcc_man_power_rate: yup.string(),
  prcc_man_power_total: yup.string(),
  prcc_total: yup.string(),
  prcc_project_waiting_time: yup.string(),
  prcc_project_waiting_time_total: yup.string(),
  prcc_project_price: yup.string(),
};

const PostCalculation = ({
  _project_id,
  onOpenChange,
}: {
  _project_id?: any;
  onOpenChange?: any;
}) => {
  const access_token = useContext(AccessTokenContext);
  const yupSchema = yup.object(yupObject);
  const [projectTotalCost, setProjectTotalCost] = useState<any>(0);
  const [hourRate, setHourRate] = useState<any>(0);
  const [dayRate, setDayRate] = useState<any>(0);
  const [eqpRentRate, setEqpRentRate] = useState<any>(0);
  const [eqpMaintenanceRate, setEqpMaintenanceRate] = useState<any>(0);
  const [eqpPackingRate, setEqpPackingRate] = useState<any>(0);

  const { data, isLoading, error, mutate } = useSWR(
    [
      _project_id
        ? `/api/projects/${_project_id}/scope/getProjectCalculation/1`
        : null,
      access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control,
    reset,
    getValues,
  } = useForm({
    resolver: yupResolver(yupSchema),
    defaultValues: {
      prcc_service_burners: 0,
      prcc_oil_burner: 0,
      prcc_engineer: 0,
      prcc_days: 0,
      prcc_hour_rate: 0,
      prcc_day_rate: 0,
      prcc_sea_freight_rate: 0,
      prcc_sea_freight_ways: 0,
      prcc_sea_freight_total: 0,
      prcc_trucking_rate: 0,
      prcc_trucking_ways: 0,
      prcc_trucking_total: 0,
      prcc_air_ticket_rate: 0,
      prcc_air_ticket_eng: 0,
      prcc_air_ticket_total: 0,
      prcc_travel_rate: 0,
      prcc_travel_eng: 0,
      prcc_travel_total: 0,
      prcc_site_visit_rate: 0,
      prcc_site_visit_total: 0,
      prcc_rental_car_rate: 0,
      prcc_rental_car_days: 0,
      prcc_rental_car_total: 0,
      prcc_crane_rate: 0,
      prcc_crane_total: 0,
      prcc_documents_rate: 0,
      prcc_documents_total: 0,
      prcc_hotel_rate: 0,
      prcc_hotel_rooms: 0,
      prcc_hotel_total: 0,
      prcc_traveling_days: 0,
      prcc_traveling_rate: 0,
      prcc_traveling_eng: 0,
      prcc_traveling_total: 0,
      prcc_installation_days: 0,
      prcc_installation_rate: 0,
      prcc_installation_eng: 0,
      prcc_installation_total: 0,
      prcc_dismantling_days: 0,
      prcc_dismantling_rate: 0,
      prcc_dismantling_eng: 0,
      prcc_dismantling_total: 0,
      prcc_equipment_rent_day_rate: 0,
      prcc_equipment_rent_day_total: 0,
      prcc_equipment_rent_day_sets: 0,
      prcc_equipment_rent_days: 0,
      prcc_equipment_maintenance_day_rate: 0,
      prcc_equipment_maintenance_day_total: 0,
      prcc_equipment_maintenance_sets: 0,
      prcc_equipment_maintenance_days: 0,
      prcc_equipment_packing_day_rate: 0,
      prcc_equipment_packing_day_sets: 0,
      prcc_equipment_packing_day_total: 0,
      prcc_liability_insurance_percentage: 0,
      prcc_liability_insurance_total: 0,
      prcc_hotwork_share_percentage: 0,
      prcc_hotwork_share_total: 0,
      prcc_profit_percentage: 0,
      prcc_profit_percentage_total: 0,
      prcc_other_costs: 0,
      prcc_other_costs_total: 0,
      prcc_man_power: 0,
      prcc_man_power_days: 0,
      prcc_man_power_rate: 0,
      prcc_man_power_total: 0,
      prcc_total: 0,
      prcc_project_price: 0,
      prcc_project_waiting_time: 0,
      prcc_project_waiting_time_total: 0,
    },
  });

  const [currency, setCurrency] = useState(data ? data.currency : "€");

  async function onSave(data: any) {
    try {
      const payload = {
        ...data,
      };

      const res = await fetch(
        `${baseUrl}/api/projects/${_project_id}/scope/addCalculation/1`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: authHeaders(access_token),
        }
      );
      const json = await res.json();
      if (json && json.success) {
        toast({
          title: json.message,
          variant: "success",
          duration: 4000,
        });
        setTimeout(() => {
          onOpenChange && onOpenChange(false);
          mutate(data);
        }, 300);
      }
      if (onOpenChange) {
        onOpenChange(false);
      }
    } catch {}
  }

  const setCalculationValues = useCallback(() => {
    setValue("prcc_service_burners", data.prcc_service_burners);
    setValue("prcc_oil_burner", data.prcc_oil_burner);
    setValue("prcc_engineer", data.prcc_engineer);
    setValue("prcc_days", data.prcc_days);
    setValue("prcc_hour_rate", data.prcc_hour_rate);
    setValue("prcc_day_rate", data.prcc_day_rate);
    setValue("prcc_sea_freight_rate", data.prcc_sea_freight_rate);
    setValue("prcc_sea_freight_ways", data.prcc_sea_freight_ways);
    setValue("prcc_trucking_rate", data.prcc_trucking_rate);
    setValue("prcc_trucking_ways", data.prcc_trucking_ways);
    setValue("prcc_air_ticket_rate", data.prcc_air_ticket_rate);
    setValue("prcc_travel_rate", data.prcc_travel_rate);
    setValue("prcc_site_visit_rate", data.prcc_site_visit_rate);
    setValue("prcc_rental_car_rate", data.prcc_rental_car_rate);
    setValue("prcc_crane_rate", data.prcc_crane_rate);
    setValue("prcc_documents_rate", data.prcc_documents_rate);
    setValue("prcc_hotel_rate", data.prcc_hotel_rate);
    setValue("prcc_hotel_rooms", data.prcc_hotel_rooms);
    setValue("prcc_traveling_days", data.prcc_traveling_days);
    setValue("prcc_installation_days", data.prcc_installation_days);
    setValue("prcc_dismantling_days", data.prcc_dismantling_days);
    setValue("prcc_equipment_rent_day_rate", data.prcc_equipment_rent_day_rate);
    setValue(
      "prcc_equipment_maintenance_day_rate",
      data.prcc_equipment_maintenance_day_rate
    );
    setValue(
      "prcc_equipment_packing_day_rate",
      data.prcc_equipment_packing_day_rate
    );
    setValue(
      "prcc_liability_insurance_percentage",
      data.prcc_liability_insurance_percentage
    );
    setValue(
      "prcc_hotwork_share_percentage",
      data.prcc_hotwork_share_percentage
    );
    setValue("prcc_profit_percentage", data.prcc_profit_percentage);
    setValue("prcc_other_costs", data.prcc_other_costs);
  }, [data, setValue]);

  const getCalculation = useCallback(() => {
    const inputData = getValues();

    let totalSets =
      Number(inputData.prcc_service_burners) +
      Number(inputData.prcc_oil_burner);
    setValue(
      "prcc_equipment_rent_day_sets",
      Number(totalSets).toLocaleString()
    );
    setValue(
      "prcc_equipment_maintenance_sets",
      Number(totalSets).toLocaleString()
    );
    setValue(
      "prcc_equipment_packing_day_sets",
      Number(totalSets).toLocaleString()
    );
    let totalEngineers = Number(inputData.prcc_engineer);
    setValue("prcc_engineer", Number(totalEngineers).toLocaleString());
    setValue("prcc_air_ticket_eng", Number(totalEngineers).toLocaleString());
    setValue("prcc_travel_eng", Number(totalEngineers).toLocaleString());
    setValue("prcc_traveling_eng", Number(totalEngineers).toLocaleString());
    setValue("prcc_installation_eng", Number(totalEngineers).toLocaleString());
    setValue("prcc_dismantling_eng", Number(totalEngineers).toLocaleString());
    setValue("prcc_man_power", Number(totalEngineers).toLocaleString());

    let dayRate = Number(inputData.prcc_day_rate);
    setValue("prcc_traveling_rate", Number(dayRate).toLocaleString());
    setValue("prcc_installation_rate", Number(dayRate).toLocaleString());
    setValue("prcc_dismantling_rate", Number(dayRate).toLocaleString());
    setValue("prcc_man_power_rate", Number(dayRate).toLocaleString());

    let workDays = Number(inputData.prcc_days);
    setValue("prcc_rental_car_days", Number(workDays).toLocaleString());
    setValue("prcc_equipment_rent_days", Number(workDays).toLocaleString());
    setValue(
      "prcc_equipment_maintenance_days",
      Number(workDays).toLocaleString()
    );
    setValue("prcc_man_power_days", Number(workDays).toLocaleString());

    let seaFreightTotal = Math.round(
      Number(inputData.prcc_sea_freight_rate) *
        Number(inputData.prcc_sea_freight_ways)
    );
    setValue(
      "prcc_sea_freight_total",
      Number(seaFreightTotal).toLocaleString()
    );
    let truckingTotal = Math.round(
      Number(inputData.prcc_trucking_rate) *
        Number(inputData.prcc_trucking_ways)
    );
    setValue("prcc_trucking_total", Number(truckingTotal).toLocaleString());
    let airTicketTotal = Math.round(
      Number(inputData.prcc_air_ticket_rate) * Number(inputData.prcc_engineer)
    );
    setValue("prcc_air_ticket_total", Number(airTicketTotal).toLocaleString());
    let travelTotal = Math.round(
      Number(inputData.prcc_travel_rate) * Number(inputData.prcc_engineer)
    );
    setValue("prcc_travel_total", Number(travelTotal).toLocaleString());
    let siteVisitRate = Math.round(Number(inputData.prcc_site_visit_rate));
    setValue("prcc_site_visit_total", Number(siteVisitRate).toLocaleString());
    let rentalCarTotal = Math.round(
      Number(inputData.prcc_rental_car_rate) * Number(inputData.prcc_days)
    );
    setValue("prcc_rental_car_total", Number(rentalCarTotal).toLocaleString());
    let craneRate = Math.round(Number(inputData.prcc_crane_rate));
    setValue("prcc_crane_total", Number(craneRate).toLocaleString());
    let documentsRate = Math.round(Number(inputData.prcc_documents_rate));
    setValue("prcc_documents_total", Number(documentsRate).toLocaleString());

    let hotelTotal = Math.round(
      Number(inputData.prcc_hotel_rate) *
        Number(inputData.prcc_hotel_rooms) *
        (Number(inputData.prcc_installation_days) +
          Number(inputData.prcc_dismantling_days) +
          Number(inputData.prcc_days))
    );
    setValue("prcc_hotel_total", Number(hotelTotal).toLocaleString());
    let travelingTotal = Math.round(
      inputData.prcc_engineer * dayRate * inputData.prcc_traveling_days
    );
    setValue("prcc_traveling_total", Number(travelingTotal).toLocaleString());
    let installationTotal = Math.round(
      inputData.prcc_engineer * dayRate * inputData.prcc_installation_days
    );
    setValue(
      "prcc_installation_total",
      Number(installationTotal).toLocaleString()
    );
    let dismantlingTotal = Math.round(
      inputData.prcc_engineer * dayRate * inputData.prcc_dismantling_days
    );
    setValue(
      "prcc_dismantling_total",
      Number(dismantlingTotal).toLocaleString()
    );
    let equipmentRentTotal = Math.round(
      totalSets * inputData.prcc_days * inputData.prcc_equipment_rent_day_rate
    );
    setValue(
      "prcc_equipment_rent_day_total",
      Number(equipmentRentTotal).toLocaleString()
    );

    let equipmentMaintenanceTotal = Math.round(
      Number(totalSets) *
        Number(inputData.prcc_days) *
        Number(inputData.prcc_equipment_maintenance_day_rate)
    );
    setValue(
      "prcc_equipment_maintenance_day_total",
      Number(equipmentMaintenanceTotal).toLocaleString()
    );

    let equipmentPackingTotal = Math.round(
      Number(totalSets) * Number(inputData.prcc_equipment_packing_day_rate)
    );
    setValue(
      "prcc_equipment_packing_day_total",
      Number(equipmentPackingTotal).toLocaleString()
    );
    let manpowerTotal = Math.round(
      Number(inputData.prcc_engineer) *
        Number(inputData.prcc_day_rate) *
        Number(inputData.prcc_days)
    );
    setValue("prcc_man_power_total", Number(manpowerTotal).toLocaleString());

    let otherCostsTotal = Math.round(Number(inputData.prcc_other_costs));
    setValue(
      "prcc_other_costs_total",
      Number(otherCostsTotal).toLocaleString()
    );

    //TOTAL
    let total =
      Number(seaFreightTotal) +
      Number(truckingTotal) +
      Number(airTicketTotal) +
      Number(travelTotal) +
      Number(siteVisitRate) +
      Number(rentalCarTotal) +
      Number(craneRate) +
      Number(documentsRate) +
      Number(hotelTotal) +
      Number(travelingTotal) +
      Number(installationTotal) +
      Number(dismantlingTotal) +
      Number(equipmentRentTotal) +
      Number(equipmentMaintenanceTotal) +
      Number(equipmentPackingTotal) +
      Number(manpowerTotal) +
      Number(otherCostsTotal);

    setValue("prcc_total", Number(total).toLocaleString());

    // calculation.total = isNaN(total) ? 0 : total;
    let liabilityInsuranceTotal = Math.round(
      total * (Number(inputData.prcc_liability_insurance_percentage) / 100)
    );
    setValue(
      "prcc_liability_insurance_total",
      Number(liabilityInsuranceTotal).toLocaleString()
    );

    let hotworkShareTotal = Math.round(
      total * (Number(inputData.prcc_hotwork_share_percentage) / 100)
    );
    setValue(
      "prcc_hotwork_share_total",
      Number(hotworkShareTotal).toLocaleString()
    );

    let profitTotal = Math.round(
      total * (Number(inputData.prcc_profit_percentage) / 100)
    );
    setValue(
      "prcc_profit_percentage_total",
      Number(profitTotal).toLocaleString()
    );

    let offerPrice = Math.round(
      total +
        Number(liabilityInsuranceTotal) +
        Number(hotworkShareTotal) +
        Number(profitTotal)
    );
    setValue("prcc_project_price", Number(offerPrice).toLocaleString());

    let waitingTimeTotal = Math.round(
      totalSets * Number(inputData.prcc_equipment_rent_day_rate) +
        Number(inputData.prcc_engineer) * Number(inputData.prcc_day_rate)
    );
    setValue(
      "prcc_project_waiting_time_total",
      Number(waitingTimeTotal).toLocaleString()
    );

    let waitingTimeForTwoYears = Math.round(waitingTimeTotal / 24);
    setValue(
      "prcc_project_waiting_time",
      Number(waitingTimeForTwoYears).toLocaleString()
    );

    setProjectTotalCost(total);
  }, [setValue, getValues]);

  useEffect(() => {
    if (data) {
      setCalculationValues();
      getCalculation();
    }
  }, [data, getCalculation, setCalculationValues]);

  function resetForm(e: any) {
    e.preventDefault();
    reset();
  }

  return (
    <div className="bg-white flex flex-col w-1/2">
      <form action="" method="POST" onSubmit={handleSubmit(onSave)}>
        <div className="top-[58px] inset-0 backdrop-blur-md sticky z-10 p-3 flex justify-between">
          <p className="text-lg font-medium text-stone-500">Post-Calculation</p>
        </div>
        {isLoading && <Loader2 className="animate-spin mx-auto m-5" />}
        {!isLoading && (
          <div className="bg-white flex flex-col gap-3 p-3 rounded-app">
            <div className="flex gap-5">
              <div className="grid grid-cols-2 gap-2 w-1/2">
                <PostInputLabel
                  className="bg-stone-100 border-transparent"
                  error={errors && (errors.prcc_service_burners ? true : false)}
                  {...register("prcc_service_burners")}
                  suffix={"Sets"}
                  label={"Service Burner"}
                  onChange={(e: any) => {
                    setValue("prcc_service_burners", e.target.value);
                    getCalculation();
                  }}
                />
                <PostInputLabel
                  className="bg-stone-100 border-transparent focus-visible:none"
                  error={errors && (errors.prcc_oil_burner ? true : false)}
                  {...register("prcc_oil_burner")}
                  suffix={"Sets"}
                  label={"Oil Burner"}
                  onChange={(e: any) => {
                    setValue("prcc_oil_burner", e.target.value);
                    getCalculation();
                  }}
                />
                <PostInputLabel
                  className="bg-stone-100 border-transparent focus-visible:none"
                  error={errors && (errors.prcc_engineer ? true : false)}
                  {...register("prcc_engineer")}
                  suffix={"Eng."}
                  label={"Engineers"}
                  onChange={(e: any) => {
                    setValue("prcc_engineer", e.target.value);
                    getCalculation();
                  }}
                />
                <Controller
                  name="prcc_hour_rate"
                  control={control}
                  render={({ field }) => (
                    <SelectSuffix
                      label={"Hour Rate"}
                      suffix={currency || ""}
                      placeholder={""}
                      rate={"hour"}
                      {...register("prcc_hour_rate")}
                      onChangeValue={(value: any) => {
                        field.onChange(value);
                        setValue("prcc_hour_rate", value);
                        getCalculation();
                      }}
                      value={Number(field.value)}
                    />
                  )}
                />

                <PostInputLabel
                  className="bg-stone-100 border-transparent focus-visible:none"
                  error={errors && (errors.prcc_days ? true : false)}
                  {...register("prcc_days")}
                  suffix={"Days"}
                  label={"Working Days"}
                  onChange={(e: any) => {
                    setValue("prcc_days", e.target.value);
                    getCalculation();
                  }}
                />

                <Controller
                  name="prcc_day_rate"
                  control={control}
                  render={({ field }) => (
                    <SelectSuffix
                      label={"Day Rate"}
                      suffix={currency || ""}
                      placeholder={""}
                      rate={"day"}
                      {...register("prcc_day_rate")}
                      onChangeValue={(value: any) => {
                        field.onChange(value);
                        setValue("prcc_day_rate", value);
                        getCalculation();
                      }}
                      value={Number(field.value)}
                    />
                  )}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-10">
                <div className="flex items-center gap-5">
                  <Button
                    className="flex gap-2"
                    onClick={(e: any) => resetForm(e)}
                  >
                    <Eraser />
                    Clear All
                  </Button>
                  <Button className="bg-red-500 flex gap-2" type="submit">
                    <Save /> Save Data
                  </Button>
                </div>
                <div className="flex flex-col items-start justify-start gap-4">
                  <p className="text-xl">Total Cost:</p>
                  <p className="bg-rose-300 flex mr-[60px] justify-start text-base p-2 rounded-app">
                    {currency} {Number(projectTotalCost).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-col mt-[20px]">
              <p className="text-base font-medium">Transport Cost</p>
              <div className="grid grid-cols-4 items-center gap-5">
                <label>Sea Freight</label>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_sea_freight_rate ? true : false)
                    }
                    {...register("prcc_sea_freight_rate")}
                    suffix={currency}
                    onChange={(e: any) => {
                      setValue("prcc_sea_freight_rate", e.target.value);
                      getCalculation();
                    }}
                    placeholder="0"
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_sea_freight_ways ? true : false)
                    }
                    {...register("prcc_sea_freight_ways")}
                    suffix={"ways"}
                    onChange={(e: any) => {
                      setValue("prcc_sea_freight_ways", e.target.value);
                      getCalculation();
                    }}
                    placeholder="0"
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_sea_freight_total ? true : false)
                    }
                    {...register("prcc_sea_freight_total")}
                    suffix={currency}
                    onChange={(e: any) => {}}
                    disabled
                    readOnly
                  />
                </div>
                <label>Trucking</label>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={errors && (errors.prcc_trucking_rate ? true : false)}
                    {...register("prcc_trucking_rate")}
                    suffix={currency}
                    placeholder={"0"}
                    onChange={(e: any) => {
                      setValue("prcc_trucking_rate", e.target.value);
                      getCalculation();
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={errors && (errors.prcc_trucking_ways ? true : false)}
                    {...register("prcc_trucking_ways")}
                    suffix={"ways"}
                    placeholder={"0"}
                    onChange={(e: any) => {
                      setValue("prcc_trucking_ways", e.target.value);
                      getCalculation();
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_trucking_total ? true : false)
                    }
                    {...register("prcc_trucking_total")}
                    suffix={currency}
                    onChange={(e: any) => {}}
                    disabled
                    readOnly
                  />
                </div>
                <label>Air Tickets</label>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_air_ticket_rate ? true : false)
                    }
                    {...register("prcc_air_ticket_rate")}
                    placeholder={"0"}
                    suffix={currency}
                    onChange={(e: any) => {
                      setValue("prcc_air_ticket_rate", e.target.value);
                      getCalculation();
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_air_ticket_eng ? true : false)
                    }
                    {...register("prcc_air_ticket_eng")}
                    suffix={"Eng."}
                    onChange={(e: any) => {}}
                    disabled
                    readOnly
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_air_ticket_total ? true : false)
                    }
                    {...register("prcc_air_ticket_total")}
                    suffix={currency}
                    onChange={(e: any) => {}}
                    disabled
                    readOnly
                  />
                </div>
                <label>Travel</label>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={errors && (errors.prcc_travel_rate ? true : false)}
                    {...register("prcc_travel_rate")}
                    placeholder={"0"}
                    suffix={currency}
                    onChange={(e: any) => {
                      setValue("prcc_travel_rate", e.target.value);
                      getCalculation();
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={errors && (errors.prcc_travel_eng ? true : false)}
                    {...register("prcc_travel_eng")}
                    suffix={"Eng."}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={errors && (errors.prcc_travel_total ? true : false)}
                    {...register("prcc_travel_total")}
                    suffix={currency}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <label>Site Visit</label>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_site_visit_rate ? true : false)
                    }
                    {...register("prcc_site_visit_rate")}
                    suffix={currency}
                    placeholder={"0"}
                    onChange={(e: any) => {
                      setValue("prcc_site_visit_rate", e.target.value);
                      getCalculation();
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_site_visit_total ? true : false)
                    }
                    {...register("prcc_site_visit_total")}
                    suffix={currency}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex justify-end"></div>
                <label>Rental Car</label>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_rental_car_rate ? true : false)
                    }
                    {...register("prcc_rental_car_rate")}
                    suffix={currency}
                    placeholder={"0"}
                    onChange={(e: any) => {
                      setValue("prcc_rental_car_rate", e.target.value);
                      getCalculation();
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_rental_car_days ? true : false)
                    }
                    {...register("prcc_rental_car_days")}
                    suffix={"Days"}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_rental_car_total ? true : false)
                    }
                    {...register("prcc_rental_car_total")}
                    suffix={currency}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2 mb-5 mt-[20px]">
              <p className="text-base font-medium">Other Costs</p>
              <div className="grid grid-cols-4 items-center gap-5">
                <label>Crane</label>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={errors && (errors.prcc_crane_rate ? true : false)}
                    {...register("prcc_crane_rate")}
                    suffix={currency}
                    placeholder={"0"}
                    onChange={(e: any) => {
                      setValue("prcc_crane_rate", e.target.value);
                      getCalculation();
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={errors && (errors.prcc_crane_total ? true : false)}
                    {...register("prcc_crane_total")}
                    suffix={currency}
                    placeholder={"0"}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex justify-end"></div>
                <label>Documents</label>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_documents_rate ? true : false)
                    }
                    {...register("prcc_documents_rate")}
                    suffix={currency}
                    placeholder={"0"}
                    onChange={(e: any) => {
                      setValue("prcc_documents_rate", e.target.value);
                      getCalculation();
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_documents_total ? true : false)
                    }
                    {...register("prcc_documents_total")}
                    suffix={currency}
                    placeholder={"0"}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex justify-end"></div>
                <label>Hotel</label>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={errors && (errors.prcc_hotel_rate ? true : false)}
                    {...register("prcc_hotel_rate")}
                    suffix={currency}
                    placeholder={"0"}
                    onChange={(e: any) => {
                      setValue("prcc_hotel_rate", e.target.value);
                      getCalculation();
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={errors && (errors.prcc_hotel_rooms ? true : false)}
                    {...register("prcc_hotel_rooms")}
                    suffix={"Room"}
                    placeholder={"0"}
                    onChange={(e: any) => {
                      setValue("prcc_hotel_rooms", e.target.value);
                      getCalculation();
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={errors && (errors.prcc_hotel_total ? true : false)}
                    {...register("prcc_hotel_total")}
                    suffix={currency}
                    placeholder={"0"}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 items-center gap-5">
                <label>Others</label>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={errors && (errors.prcc_other_costs ? true : false)}
                    {...register("prcc_other_costs")}
                    suffix={currency}
                    placeholder={"0"}
                    onChange={(e: any) => {
                      setValue("prcc_other_costs", e.target.value);
                      getCalculation();
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_other_costs_total ? true : false)
                    }
                    {...register("prcc_other_costs_total")}
                    suffix={currency}
                    placeholder={"0"}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="grid grid-cols-4 gap-5">
                <p className="text-base font-medium">Travelling</p>
                <p></p>
                <label>Day Rate</label>
                <p></p>
              </div>
              <div className="grid grid-cols-4 items-center gap-5">
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={errors && (errors.prcc_traveling_eng ? true : false)}
                    {...register("prcc_traveling_eng")}
                    suffix={"Eng."}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_traveling_days ? true : false)
                    }
                    {...register("prcc_traveling_days")}
                    suffix={"Days"}
                    onChange={(e: any) => {
                      setValue("prcc_traveling_days", e.target.value);
                      getCalculation();
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_traveling_rate ? true : false)
                    }
                    {...register("prcc_traveling_rate")}
                    suffix={currency}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_traveling_total ? true : false)
                    }
                    {...register("prcc_traveling_total")}
                    suffix={currency}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="grid grid-cols-4 gap-5">
                <p className="text-base font-medium">Installation</p>
                <p></p>
                <label>Day Rate</label>
                <p></p>
              </div>
              <div className="grid grid-cols-4 items-center gap-5">
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_installation_eng ? true : false)
                    }
                    {...register("prcc_installation_eng")}
                    suffix={"Eng."}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_installation_days ? true : false)
                    }
                    {...register("prcc_installation_days")}
                    suffix={"Days"}
                    onChange={(e: any) => {
                      setValue("prcc_installation_days", e.target.value);
                      getCalculation();
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_installation_rate ? true : false)
                    }
                    {...register("prcc_installation_rate")}
                    suffix={currency}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_installation_total ? true : false)
                    }
                    {...register("prcc_installation_total")}
                    suffix={currency}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="grid grid-cols-4 gap-5">
                <p className="text-base font-medium">Dismantling</p>
                <p></p>
                <label>Day Rate</label>
                <p></p>
              </div>
              <div className="grid grid-cols-4 items-center gap-5">
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_dismantling_eng ? true : false)
                    }
                    {...register("prcc_dismantling_eng")}
                    suffix={"Eng."}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_dismantling_days ? true : false)
                    }
                    {...register("prcc_dismantling_days")}
                    suffix={"Days"}
                    onChange={(e: any) => {
                      setValue("prcc_dismantling_days", e.target.value);
                      getCalculation();
                    }}
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_dismantling_rate ? true : false)
                    }
                    {...register("prcc_dismantling_rate")}
                    suffix={currency}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_dismantling_total ? true : false)
                    }
                    {...register("prcc_dismantling_total")}
                    suffix={currency}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="grid grid-cols-4 gap-5">
                <p className="text-base font-medium">Equipment Rent</p>
                <p></p>
                <label>Day Rate</label>
                <p></p>
              </div>
              <div className="grid grid-cols-4 items-center gap-5">
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors &&
                      (errors.prcc_equipment_rent_day_sets ? true : false)
                    }
                    {...register("prcc_equipment_rent_day_sets")}
                    suffix={"Sets"}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_equipment_rent_days ? true : false)
                    }
                    {...register("prcc_equipment_rent_days")}
                    suffix={"Days"}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <Controller
                  name="prcc_equipment_rent_day_rate"
                  control={control}
                  render={({ field }) => (
                    <SelectSuffix
                      suffix={currency || ""}
                      placeholder={""}
                      rate={"eqpRent"}
                      {...register("prcc_equipment_rent_day_rate")}
                      onChangeValue={(value: any) => {
                        field.onChange(value);
                        setValue("prcc_equipment_rent_day_rate", value);
                        getCalculation();
                      }}
                      value={Number(field.value)}
                    />
                  )}
                />
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors &&
                      (errors.prcc_equipment_rent_day_total ? true : false)
                    }
                    {...register("prcc_equipment_rent_day_total")}
                    suffix={currency}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <p className="text-base font-medium">Equipment Maintenance</p>
              <div className="grid grid-cols-4 items-center gap-5">
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors &&
                      (errors.prcc_equipment_maintenance_sets ? true : false)
                    }
                    {...register("prcc_equipment_maintenance_sets")}
                    suffix={"Sets"}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors &&
                      (errors.prcc_equipment_maintenance_days ? true : false)
                    }
                    {...register("prcc_equipment_maintenance_days")}
                    suffix={"Days"}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <Controller
                  name="prcc_equipment_maintenance_day_rate"
                  control={control}
                  render={({ field }) => (
                    <SelectSuffix
                      suffix={currency || ""}
                      placeholder={""}
                      rate={"eqpMaintenance"}
                      {...register("prcc_equipment_maintenance_day_rate")}
                      onChangeValue={(value: any) => {
                        field.onChange(value);
                        setValue("prcc_equipment_maintenance_day_rate", value);
                        getCalculation();
                      }}
                      value={Number(field.value)}
                    />
                  )}
                />
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors &&
                      (errors.prcc_equipment_maintenance_day_total
                        ? true
                        : false)
                    }
                    {...register("prcc_equipment_maintenance_day_total")}
                    suffix={currency}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="grid grid-cols-4 gap-5">
                <p className="text-base font-medium">Equipment Packing</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-5">
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors &&
                      (errors.prcc_equipment_packing_day_sets ? true : false)
                    }
                    {...register("prcc_equipment_packing_day_sets")}
                    suffix={"Sets"}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex justify-end"></div>
                <Controller
                  name="prcc_equipment_packing_day_rate"
                  control={control}
                  render={({ field }) => (
                    <SelectSuffix
                      suffix={currency || ""}
                      placeholder={""}
                      rate={"eqpPacking"}
                      {...register("prcc_equipment_packing_day_rate")}
                      onChangeValue={(value: any) => {
                        field.onChange(value);
                        setValue("prcc_equipment_packing_day_rate", value);
                        getCalculation();
                      }}
                      value={Number(field.value)}
                    />
                  )}
                />
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors &&
                      (errors.prcc_equipment_packing_day_total ? true : false)
                    }
                    {...register("prcc_equipment_packing_day_total")}
                    suffix={currency}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="grid grid-cols-4 gap-5">
                <p className="text-base font-medium">Man Power</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-5">
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={errors && (errors.prcc_man_power ? true : false)}
                    {...register("prcc_man_power")}
                    suffix={"Eng."}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_man_power_days ? true : false)
                    }
                    {...register("prcc_man_power_days")}
                    suffix={"Days"}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_man_power_rate ? true : false)
                    }
                    {...register("prcc_man_power_rate")}
                    suffix={currency}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
                <div className="flex justify-end">
                  <PostInputLabel
                    className="bg-stone-100 border-transparent focus-visible:none"
                    error={
                      errors && (errors.prcc_man_power_total ? true : false)
                    }
                    {...register("prcc_man_power_total")}
                    suffix={currency}
                    onChange={(e: any) => {}}
                    readOnly
                    disabled
                  />
                </div>
              </div>
            </div>
            <hr className="mt-2 mb-2" />
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-3 gap-5">
                <p></p>
                <p className="justify-self-end self-center text-base font-medium">
                  Total
                </p>
                <PostInputLabel
                  className="bg-stone-100 border-transparent focus-visible:none"
                  error={errors && (errors.prcc_total ? true : false)}
                  {...register("prcc_total")}
                  suffix={currency}
                  onChange={(e: any) => {}}
                  readOnly
                  disabled
                />
              </div>
              <div className="grid grid-cols-3 gap-5">
                <PostInputLabel
                  className="bg-stone-100 border-transparent focus-visible:none"
                  error={
                    errors &&
                    (errors.prcc_liability_insurance_percentage ? true : false)
                  }
                  {...register("prcc_liability_insurance_percentage")}
                  suffix={"%"}
                  placeholder="0"
                  onChange={(e: any) => {
                    setValue(
                      "prcc_liability_insurance_percentage",
                      e.target.value
                    );
                    getCalculation();
                  }}
                />
                <p className="justify-self-end self-center text-base font-medium">
                  Liability Insurance
                </p>
                <PostInputLabel
                  className="bg-stone-100 border-transparent focus-visible:none"
                  error={
                    errors &&
                    (errors.prcc_liability_insurance_total ? true : false)
                  }
                  {...register("prcc_liability_insurance_total")}
                  suffix={currency}
                  onChange={(e: any) => {}}
                  readOnly
                  disabled
                />
              </div>
              <div className="grid grid-cols-3 gap-5">
                <PostInputLabel
                  className="bg-stone-100 border-transparent focus-visible:none"
                  error={
                    errors &&
                    (errors.prcc_hotwork_share_percentage ? true : false)
                  }
                  {...register("prcc_hotwork_share_percentage")}
                  suffix={"%"}
                  onChange={(e: any) => {
                    setValue("prcc_hotwork_share_percentage", e.target.value);
                    getCalculation();
                  }}
                />
                <p className="justify-self-end self-center text-base font-medium">
                  Commissions %
                </p>
                <PostInputLabel
                  className="bg-stone-100 border-transparent focus-visible:none"
                  error={
                    errors && (errors.prcc_hotwork_share_total ? true : false)
                  }
                  {...register("prcc_hotwork_share_total")}
                  suffix={currency}
                  onChange={(e: any) => {}}
                  readOnly
                  disabled
                />
              </div>
              <div className="grid grid-cols-3 gap-5">
                <PostInputLabel
                  className="bg-stone-100 border-transparent focus-visible:none"
                  error={
                    errors && (errors.prcc_profit_percentage ? true : false)
                  }
                  {...register("prcc_profit_percentage")}
                  suffix={"%"}
                  placeholder="0"
                  onChange={(e: any) => {
                    setValue("prcc_profit_percentage", e.target.value);
                    getCalculation();
                  }}
                />
                <p className="justify-self-end self-center text-base font-medium">
                  Profit %
                </p>
                <PostInputLabel
                  className="bg-stone-100 border-transparent focus-visible:none"
                  error={
                    errors &&
                    (errors.prcc_profit_percentage_total ? true : false)
                  }
                  {...register("prcc_profit_percentage_total")}
                  suffix={currency}
                  onChange={(e: any) => {}}
                  readOnly
                  disabled
                />
              </div>
              <div className="grid grid-cols-3 gap-5">
                <p></p>
                <p className="justify-self-end self-center text-base font-medium">
                  Project Price
                </p>
                <PostInputLabel
                  className="bg-stone-100 border-transparent focus-visible:none"
                  error={errors && (errors.prcc_project_price ? true : false)}
                  {...register("prcc_project_price")}
                  suffix={currency}
                  onChange={(e: any) => {}}
                  readOnly
                  disabled
                />
              </div>
              <div className="grid grid-cols-3 gap-5">
                <PostInputLabel
                  className="bg-stone-100 border-transparent focus-visible:none"
                  error={
                    errors && (errors.prcc_project_waiting_time ? true : false)
                  }
                  {...register("prcc_project_waiting_time")}
                  suffix={currency}
                  placeholder="0"
                  onChange={(e: any) => {}}
                  readOnly
                  disabled
                />
                <p className="justify-self-end self-center text-lg font-medium">
                  Waiting Time
                </p>
                <PostInputLabel
                  className="bg-stone-100 border-transparent focus-visible:none"
                  error={
                    errors &&
                    (errors.prcc_project_waiting_time_total ? true : false)
                  }
                  {...register("prcc_project_waiting_time_total")}
                  suffix={currency}
                  onChange={(e: any) => {}}
                  readOnly
                  disabled
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default memo(PostCalculation);
