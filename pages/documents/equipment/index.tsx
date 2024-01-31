import AdminLayout from "@/components/admin-layout";
import Category from "@/components/documents/equipment/Category";
import Filter from "@/components/documents/equipment/filter";
import { AccessTokenContext } from "@/context/access-token-context";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import React, { useState } from "react";
import { baseUrl } from "@/utils/api.config";
import List from "@/components/documents/equipment/List";
import { truncate } from "lodash";

export const EquipmentDocsContext = React.createContext(null);
export const SelectedEquipmentContext = React.createContext(null);

const Context = ({
  children,
  selected_employee,
  access_token,
  employee_docs,
}: {
  children: React.ReactNode;
  selected_employee?: any;
  access_token?: any;
  employee_docs?: any;
}) => {
  return (
    <EquipmentDocsContext.Provider value={employee_docs}>
      <AccessTokenContext.Provider value={access_token}>
        <SelectedEquipmentContext.Provider value={selected_employee}>
          {children}
        </SelectedEquipmentContext.Provider>
      </AccessTokenContext.Provider>
    </EquipmentDocsContext.Provider>
  );
};

const EquipmentPage = ({ main_categories, categories, access_token, onLoad }: any) => {
  const [filterHeight, setFilterHeight] = useState(0);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);

  return (
    <AdminLayout>
      <Context
        selected_employee={selectedEquipment}
        access_token={access_token}
        employee_docs={null}
      >
        <div className="pt-[20px] px-[20px] pb-[20px] w-full max-w-[1600px] mx-auto flex gap-3">
          <div className="flex gap-5 w-full">
            <div className="w-[25%] flex flex-col gap-[10px]">
              <div className="max-w-[25%]">
                <Category
                  filterHeight={filterHeight}
                  main_categories={main_categories}
                  onClickItem={(item) => setSelectedEquipment(item)}
                  onLoad={onLoad}
                />
              </div>
            </div>
            <List />
          </div>
        </div>
      </Context>
    </AdminLayout>
  );
};

export default EquipmentPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  let token = null;

  if (session && session.user) {
    token = session.user.access_token;
  } else {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const headers = { Authorization: 'Bearer ' + token };
  let res = await fetch(baseUrl + '/api/main_categories', { headers });
  // let main_categories = await res.json();

  res = await fetch(baseUrl + '/api/categories/all', { headers });
  let main_categories = await res.json();

  let allCategories: any[] = [];

  if (main_categories && Array.isArray(main_categories)) {
    main_categories.forEach((item: any) => {
      if (item.categories && Array.isArray(item.categories)) {
        item.categories.forEach((item: any) => {
          allCategories.push({
            ...item
          })
        });
      }
    });
  }

  return {
    props: {
      main_categories,
      categories: allCategories,
      access_token: token,
      onLoad: true
    },
  };
}
