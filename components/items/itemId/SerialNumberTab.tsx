import { useContext, useEffect, useState } from "react";
import { authHeaders, baseUrl } from "@/utils/api.config";
import SerialNumbers from "../SerialNumbers";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { EquipmentContext } from "./Layout";
import { AccessTokenContext } from "@/context/access-token-context";
import { useRouter } from "next/router";

export function SerialNumberTab() {
  const [warehouses, setWarehouses] = useState<any>(null);
  const equipment: any = useContext(EquipmentContext);
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();

  useEffect(() => {
    async function getWarehouse() {
      const res = await fetch(
        baseUrl + "/api/warehouse/all?_item_id=" + router.query.item_id,
        {
          headers: { ...authHeaders(access_token) },
        }
      );
      const json = await res.json();
      setWarehouses(json);
    }
    getWarehouse();
  }, [access_token, router.query.item_id]);

  return (
    <>
      {warehouses &&
        warehouses.map((warehouse: any, key: number) => (
          <div key={key} className="mb-6">
            <div className="flex justify-between items-center mb-3">
              <p className="font-medium text-lg">
                {warehouse.warehouse_location}
              </p>
            </div>
            <div className="shadow-sm rounded-xl overflow-hidden bg-white">
              <SerialNumbers
                _item_id={router.query.item_id as any}
                selectedItem={equipment}
                _warehouse_id={warehouse._warehouse_id}
                additionalActionButton={[
                  {
                    name: "Manage Status",
                    icon: (
                      <Settings
                        className={cn("mr-2 h-[18px] w-[18px] text-stone-600")}
                        strokeWidth={2}
                      />
                    ),
                    actionType: "manage-status",
                  },
                ]}
              />
            </div>
          </div>
        ))}
    </>
  );
}
