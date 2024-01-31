import { useState } from "react";
import { faker } from "@faker-js/faker";
import { ItemMenu, TD } from "@/components/items";
import MoreOption from "@/components/MoreOption";
import Image from "next/image";
import { Plus, ArrowRightLeft, Link, Trash } from "lucide-react";

export const TableBody = () => {
  const [companies] = useState([
    {
      id: 1,
      name: "Alsachimie BASF",
      location: "R. REMEDIO ST. CABANCALAN, , CEBU, Philippines",
      contact: "123456789",
      website: "Fax",
      category: "clients",
    },
    {
      id: 2,
      name: "SPCI OSC SILICATE (M) SDN. BHD.",
      location:
        "Kawasan Perindustrian Gebeng, 26080 ,, Kuantan Pahang Darul Makmur, Malaysia	",
      contact: "123456789",
      website: "Fax",
      category: "clients",
    },
    {
      id: 3,
      name: '"K" Line Logistic',
      location: "A.C Cortes Avenue, Brgy. Alang-Alang, Mandaue, Philippines",
      contact: "123456789",
      website: "Fax",
      category: "clients",
    },
  ]);
  return (
    <>
      <tbody>
        {companies &&
          companies.map((item: any, i) => (
            <tr key={i}>
              <TD className="ps-4 py-2 align-top">
                <Image
                  src={faker.image.urlPicsumPhotos({ width: 400, height: 400 })}
                  alt="Test Alt"
                  className="rounded-app"
                  width={60}
                  height={60}
                />
              </TD>
              <TD className="py-2 px-3 text-center font-medium align-top">
                {item.id}
              </TD>
              <TD className="py-2 px-3 align-top">
                <div className="flex flex-col gap-1">
                  <span className="font-medium">{item.name}</span>
                  <span>{item.location}</span>
                </div>
              </TD>
              <TD className="py-2 px-3 align-top">{item.contact}</TD>
              <TD className="py-2 px-3 align-top">{item.website}</TD>
              <TD className="py-2 px-3 align-top">{item.category}</TD>
              <TD className="py-2 px-3 align-top text-right">
                <MoreOption>
                  <ItemMenu>
                    <ArrowRightLeft
                      strokeWidth={1}
                      className="w-[18px] h-[18px]"
                    />
                    <span className="font-medium">Change Category</span>
                  </ItemMenu>
                  <ItemMenu>
                    <Link strokeWidth={1} className="w-[18px] h-[18px]" />
                    <span className="font-medium">Link to Company</span>
                  </ItemMenu>
                  <ItemMenu>
                    <Plus strokeWidth={1} className="w-[18px] h-[18px]" />
                    <span className="font-medium">Add to all Categories</span>
                  </ItemMenu>
                  <ItemMenu>
                    <Trash strokeWidth={1} className="w-[18px] h-[18px]" />
                    <span className="font-medium">Delete</span>
                  </ItemMenu>
                </MoreOption>
              </TD>
            </tr>
          ))}
      </tbody>
    </>
  );
};
