import { memo, useCallback, useContext, useEffect, useState } from "react";
import { InputLabel, InputSuffix } from "./FormElements/InputLabel";
import { AccessTokenContext } from "@/context/access-token-context";
import { useRouter } from "next/router";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import { Loader2 } from "lucide-react";

const PreCalculation = ({ _project_id }: { _project_id?: any }) => {
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();
  const [totals, setTotals] = useState<any>({});

  const { data, isLoading, error, mutate } = useSWR(
    [
      _project_id
        ? `/api/projects/${_project_id}/scope/getProjectCalculation/0`
        : null,
      access_token,
    ],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const [currency, setCurrency] = useState(data ? data.currency : "€");

  const getCalculation = useCallback(() => {
    let calculation: any = {};
    if (data) {
      let totalSets =
        Number(data.prcc_service_burners) + Number(data.prcc_oil_burner);
      calculation.totalSets = totalSets;
      calculation.seaFreightTotal = Math.round(
        Number(data.prcc_sea_freight_rate) * Number(data.prcc_sea_freight_ways)
      );
      calculation.truckingTotal = Math.round(
        Number(data.prcc_trucking_rate) * Number(data.prcc_trucking_ways)
      );
      calculation.airTicketTotal = Math.round(
        Number(data.prcc_air_ticket_rate) * Number(data.prcc_engineer)
      );
      calculation.travelTotal = Math.round(
        Number(data.prcc_travel_rate) * Number(data.prcc_engineer)
      );
      calculation.siteVisitRate = Math.round(Number(data.prcc_site_visit_rate));
      calculation.rentalCarTotal = Math.round(
        Number(data.prcc_rental_car_rate) * Number(data.prcc_days)
      );
      calculation.craneRate = Math.round(Number(data.prcc_crane_rate));
      calculation.documentsRate = Math.round(Number(data.prcc_documents_rate));
      calculation.hotelTotal = Math.round(
        Number(data.prcc_hotel_rate) *
          Number(data.prcc_hotel_rooms) *
          (Number(data.prcc_installation_days) +
            Number(data.prcc_dismantling_days) +
            Number(data.prcc_days))
      );
      calculation.travelingTotal = Math.round(
        Number(data.prcc_engineer) *
          Number(data.prcc_day_rate) *
          Number(data.prcc_traveling_days)
      );
      calculation.installationTotal = Math.round(
        Number(data.prcc_engineer) *
          Number(data.prcc_day_rate) *
          Number(data.prcc_installation_days)
      );
      calculation.dismantlingTotal = Math.round(
        Number(data.prcc_engineer) *
          Number(data.prcc_day_rate) *
          Number(data.prcc_dismantling_days)
      );
      calculation.equipmentRentTotal = Math.round(
        Number(totalSets) *
          Number(data.prcc_days) *
          Number(data.prcc_equipment_rent_day_rate)
      );
      calculation.equipmentMaintenanceTotal = Math.round(
        Number(totalSets) *
          Number(data.prcc_days) *
          Number(data.prcc_equipment_maintenance_day_rate)
      );
      calculation.equipmentPackingTotal = Math.round(
        Number(totalSets) * Number(data.prcc_equipment_packing_day_rate)
      );
      calculation.manpowerTotal = Math.round(
        Number(data.prcc_engineer) *
          Number(data.prcc_day_rate) *
          Number(data.prcc_days)
      );
      calculation.otherCostsTotal = Math.round(Number(data.prcc_other_costs));
      //TOTAL
      let total =
        Number(calculation.seaFreightTotal) +
        Number(calculation.truckingTotal) +
        Number(calculation.airTicketTotal) +
        Number(calculation.travelTotal) +
        Number(calculation.siteVisitRate) +
        Number(calculation.rentalCarTotal) +
        Number(calculation.craneRate) +
        Number(calculation.documentsRate) +
        Number(calculation.hotelTotal) +
        Number(calculation.travelingTotal) +
        Number(calculation.installationTotal) +
        Number(calculation.dismantlingTotal) +
        Number(calculation.equipmentRentTotal) +
        Number(calculation.equipmentMaintenanceTotal) +
        Number(calculation.equipmentPackingTotal) +
        Number(calculation.manpowerTotal) +
        Number(calculation.otherCostsTotal);

      calculation.total = isNaN(total) ? 0 : total;
      calculation.liabilityInsuranceTotal = Math.round(
        total * (Number(data.prcc_liability_insurance_percentage) / 100)
      );
      calculation.hotworkShareTotal = Math.round(
        total * (Number(data.prcc_hotwork_share_percentage) / 100)
      );
      calculation.profitTotal = Math.round(
        total * (Number(data.prcc_profit_percentage) / 100)
      );
      calculation.offerPrice = Math.round(
        total +
          Number(calculation.liabilityInsuranceTotal) +
          Number(calculation.hotworkShareTotal) +
          Number(calculation.profitTotal)
      );
      calculation.waitingTimeTotal = Math.round(
        totalSets * Number(data.prcc_equipment_rent_day_rate) +
          Number(data.prcc_engineer) * Number(data.prcc_day_rate)
      );
      calculation.waitingTimeForTwoYears = Math.round(
        calculation.waitingTimeTotal / 24
      );
    }
    return calculation;
  }, [data]);

  useEffect(() => {
    if (data) {
      setTotals(getCalculation());
    }
  }, [data, getCalculation]);

  return (
    <div className="bg-white flex flex-col w-1/2">
      <div className="top-[58px] inset-0 backdrop-blur-md sticky z-10 p-3 flex justify-between">
        <p className="text-lg font-medium text-stone-500">Pre-Calculation</p>
      </div>
      {isLoading && <Loader2 className="animate-spin mx-auto m-5" />}
      {!isLoading && (
        <div className="bg-white flex flex-col gap-3 p-3 rounded-app">
          <div className="flex gap-5">
            <div className="grid grid-cols-2 gap-2 w-1/2">
              <InputLabel
                label={"Unit Value"}
                suffix={"Sets"}
                placeholder={"0"}
                _value={data && data.prcc_service_burners}
                readonly={true}
                disabled={true}
              />
              <InputLabel
                label={"Oil Burner"}
                suffix={"Sets"}
                placeholder={"0"}
                _value={data && data?.prcc_oil_burner}
                readonly={true}
                disabled={true}
              />
              <InputLabel
                label={"Engineers"}
                suffix={"Eng"}
                placeholder={""}
                _value={data && data?.prcc_engineer}
                readonly={true}
                disabled={true}
              />
              <InputLabel
                label={"Hour Rate"}
                suffix={currency || ""}
                placeholder={""}
                _value={data && data?.prcc_hour_rate}
                readonly={true}
                disabled={true}
              />
              <InputLabel
                label={"Working Days"}
                suffix={"Days"}
                placeholder={""}
                _value={data && data?.prcc_days}
                readonly={true}
                disabled={true}
              />
              <InputLabel
                label={"Day Rate"}
                suffix={currency || ""}
                placeholder={""}
                _value={data && data?.prcc_day_rate}
                readonly={true}
                disabled={true}
              />
            </div>
            <div className="flex flex-col items-center justify-end w-1/2 gap-4">
              <p className="text-xl">Total Cost:</p>
              <p className="bg-rose-300 flex justify-start text-base p-2 rounded-app">
                {currency}{" "}
                {(data && Number(totals.total).toLocaleString()) || 0}
              </p>
            </div>
          </div>
          <div className="flex flex-col mt-[20px]">
            <p className="text-base font-medium">Transport Cost</p>
            <div className="grid grid-cols-4 items-center gap-5">
              <label>Sea Freight</label>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={"0"}
                  _value={data && data?.prcc_sea_freight_rate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={"ways"}
                  placeholder={"0"}
                  _value={data && data?.prcc_sea_freight_ways}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={totals && totals?.seaFreightTotal}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <label>Trucking</label>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={"0"}
                  _value={data && data?.prcc_trucking_rate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={"ways"}
                  placeholder={"0"}
                  _value={data && data?.prcc_trucking_ways}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={totals && totals?.truckingTotal}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <label>Air Tickets</label>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={"0"}
                  _value={data && data?.prcc_air_ticket_rate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={"Eng."}
                  placeholder={""}
                  _value={data && data?.prcc_engineer}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={totals && totals?.airTicketTotal}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <label>Travel</label>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={"0"}
                  _value={data?.prcc_travel_rate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={"Eng."}
                  placeholder={""}
                  _value={data?.prcc_engineer}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={totals && totals.travelTotal}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <label>Site Visit</label>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={"0"}
                  _value={data && data?.prcc_site_visit_rate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={totals && totals?.siteVisitRate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end"></div>
              <label>Rental Car</label>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={"0"}
                  _value={data && data?.prcc_rental_car_rate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={"Days"}
                  placeholder={""}
                  _value={data && data?.prcc_days}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={totals && totals?.rentalCarTotal}
                  readonly={true}
                  disabled={true}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 mb-5 mt-[20px]">
            <p className="text-base font-medium">Other Costs</p>
            <div className="grid grid-cols-4 items-center gap-5">
              <label>Crane</label>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={"0"}
                  _value={data && data?.prcc_crane_rate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={"0"}
                  _value={totals && totals?.craneRate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end"></div>
              <label>Documents</label>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={"0"}
                  _value={data && data?.prcc_documents_rate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={"0"}
                  _value={totals && totals?.documentsRate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end"></div>
              <label>Hotel</label>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={"0"}
                  _value={data && data?.prcc_hotel_rate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={"Room"}
                  placeholder={"0"}
                  _value={data && data?.prcc_hotel_rooms}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={totals && totals?.hotelTotal}
                  readonly={true}
                  disabled={true}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col mt-[48px]">
            <div className="grid grid-cols-4 gap-5">
              <p className="text-base font-medium">Travelling</p>
              <p></p>
              <label>Day Rate</label>
              <p></p>
            </div>
            <div className="grid grid-cols-4 items-center gap-5">
              <div className="flex justify-end">
                <InputSuffix
                  suffix={"Eng."}
                  placeholder={""}
                  _value={data && data?.prcc_traveling_days}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={"Days"}
                  placeholder={""}
                  _value={data && data?.prcc_engineer}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={data && data?.prcc_day_rate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={totals && totals.travelingTotal}
                  readonly={true}
                  disabled={true}
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
                <InputSuffix
                  suffix={"Eng."}
                  placeholder={""}
                  _value={data && data?.prcc_installation_days}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={"Days"}
                  placeholder={""}
                  _value={data && data?.prcc_engineer}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={data && data?.prcc_day_rate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={totals && totals?.installationTotal}
                  readonly={true}
                  disabled={true}
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
                <InputSuffix
                  suffix={"Eng."}
                  placeholder={""}
                  _value={data && data?.prcc_dismantling_days}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={"Days"}
                  placeholder={""}
                  _value={data && data?.prcc_engineer}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={data && data?.prcc_day_rate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={totals && totals?.dismantlingTotal}
                  readonly={true}
                  disabled={true}
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
                <InputSuffix
                  suffix={"Sets"}
                  placeholder={""}
                  _value={totals && totals?.totalSets}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={"Days"}
                  placeholder={""}
                  _value={data && data?.prcc_days}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={data && data?.prcc_equipment_rent_day_rate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={totals && totals?.equipmentRentTotal}
                  readonly={true}
                  disabled={true}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <p className="text-base font-medium">Equipment Maintenance</p>
            <div className="grid grid-cols-4 items-center gap-5">
              <div className="flex justify-end">
                <InputSuffix
                  suffix={"Sets"}
                  placeholder={""}
                  _value={totals && totals?.totalSets}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={"Days"}
                  placeholder={""}
                  _value={data && data?.prcc_days}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={data && data?.prcc_equipment_maintenance_day_rate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={totals && totals?.equipmentMaintenanceTotal}
                  readonly={true}
                  disabled={true}
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
                <InputSuffix
                  suffix={"Sets"}
                  placeholder={""}
                  _value={totals && totals?.totalSets}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end"></div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={data && data?.prcc_equipment_packing_day_rate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={totals && totals?.equipmentPackingTotal}
                  readonly={true}
                  disabled={true}
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
                <InputSuffix
                  suffix={"Eng."}
                  placeholder={""}
                  _value={data && data?.prcc_engineer}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={"Days"}
                  placeholder={""}
                  _value={data && data?.prcc_days}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={data && data?.prcc_day_rate}
                  readonly={true}
                  disabled={true}
                />
              </div>
              <div className="flex justify-end">
                <InputSuffix
                  suffix={currency || ""}
                  placeholder={""}
                  _value={totals && totals?.manpowerTotal}
                  readonly={true}
                  disabled={true}
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
              <InputSuffix
                suffix={currency || ""}
                placeholder={""}
                _value={totals && totals?.total}
                readonly={true}
                disabled={true}
              />
            </div>
            <div className="grid grid-cols-3 gap-5">
              <InputSuffix
                suffix={"%"}
                placeholder={"0"}
                _value={data && data?.prcc_liability_insurance_percentage}
                readonly={true}
                disabled={true}
              />
              <p className="justify-self-end self-center text-base font-medium">
                Liability Insurance
              </p>
              <InputSuffix
                suffix={currency || ""}
                placeholder={""}
                _value={totals && totals?.liabilityInsuranceTotal}
                readonly={true}
                disabled={true}
              />
            </div>
            <div className="grid grid-cols-3 gap-5">
              <InputSuffix
                suffix={"%"}
                placeholder={"0"}
                _value={data && data?.prcc_hotwork_share_percentage}
                readonly={true}
                disabled={true}
              />
              <p className="justify-self-end self-center text-base font-medium">
                Commissions %
              </p>
              <InputSuffix
                suffix={currency || ""}
                placeholder={""}
                _value={totals && totals?.hotworkShareTotal}
                readonly={true}
                disabled={true}
              />
            </div>
            <div className="grid grid-cols-3 gap-5">
              <InputSuffix
                suffix={"%"}
                placeholder={"0"}
                _value={data && data?.prcc_profit_percentage}
                readonly={true}
                disabled={true}
              />
              <p className="justify-self-end self-center text-base font-medium">
                Profit %
              </p>
              <InputSuffix
                suffix={currency || ""}
                placeholder={""}
                _value={totals && totals?.profitTotal}
                readonly={true}
                disabled={true}
              />
            </div>
            <div className="grid grid-cols-3 gap-5">
              <p></p>
              <p className="justify-self-end self-center text-base font-medium">
                Project Price
              </p>
              <InputSuffix
                suffix={currency || ""}
                placeholder={""}
                _value={totals && totals?.offerPrice}
                readonly={true}
                disabled={true}
              />
            </div>
            <div className="grid grid-cols-3 gap-5">
              <InputSuffix
                suffix={currency || ""}
                placeholder={"0"}
                _value={totals && totals?.waitingTimeForTwoYears}
                readonly={true}
                disabled={true}
              />
              <p className="justify-self-end self-center text-lg font-medium">
                Waiting Time
              </p>
              <InputSuffix
                suffix={currency || ""}
                placeholder={""}
                _value={totals && totals?.waitingTimeTotal}
                readonly={true}
                disabled={true}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(PreCalculation);
