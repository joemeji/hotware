import { useEffect, useState } from "react";
import { TabType } from ".";
import { authHeaders, baseUrl } from "@/utils/api.config";
import SerialNumbers from "../SerialNumbers";
import { QrCode } from "lucide-react";
import { cn } from "@/lib/utils";

interface SnTabType extends TabType {
  equipment?: any;
  access_token?: string
}

export function SerialNumberTab(props: SnTabType) {
  const { _item_id, equipment, access_token } = props;
  const [warehouses, setWarehouses] = useState<any>(null);

  useEffect(() => {
    async function getWarehouse() {
      const res = await fetch(baseUrl + '/api/warehouse/all?_item_id=' + _item_id, {
        headers: { ...authHeaders(access_token) }
      });
      const json = await res.json();
      setWarehouses(json);
    }
    getWarehouse();
  }, [access_token, _item_id]);

  return (
    <>
      {warehouses && warehouses.map((warehouse: any, key: number) => (
        <div key={key} className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <p className="font-medium text-lg">
              {warehouse.warehouse_location}
            </p>
          </div>
          <div className="shadow-sm rounded-xl overflow-hidden bg-white">
            <SerialNumbers 
              _item_id={_item_id}
              selectedItem={equipment}
              _warehouse_id={warehouse._warehouse_id}
              additionalActionButton={[
                {
                  name: 'Manage Status',
                  icon: <QrCode className={cn("mr-2 h-[18px] w-[18px] text-blue-400")} strokeWidth={2} />,
                  actionType: 'manage-status',
                },
              ]}
            />
          </div>
        </div>
      ))}
    </>
  );

}