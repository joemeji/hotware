import AdminLayout from "@/components/admin-layout";
import Employees from "@/components/documents/employees/employees";
import Filter from "@/components/documents/employees/filter";
import List from "@/components/documents/employees/list";
import { ServiceSetting } from "@/components/settings/user/Services";
import { AccessTokenContext } from "@/context/access-token-context";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import React, { useState } from "react";

export const SelectedServicesContext = React.createContext(null);

const Context = ({
  children,
  selected_service,
  access_token,
}: {
  children: React.ReactNode;
  selected_service?: any;
  access_token?: any;
  employee_docs?: any;
}) => {
  return (
    <AccessTokenContext.Provider value={access_token}>
      <SelectedServicesContext.Provider value={selected_service}>
        {children}
      </SelectedServicesContext.Provider>
    </AccessTokenContext.Provider>
  );
};

const EmployeesPage = ({ access_token }: any) => {
  const [selectedService, setSelectedService] = useState<any>(null);

  return (
    <AdminLayout>
      <Context
        selected_service={selectedService}
        access_token={access_token}
        employee_docs={null}
      >
        <div className="pt-[20px] px-[20px] pb-[20px] w-full max-w-[1600px] mx-auto flex gap-3">
          <div className="flex gap-3 w-full">
            <ServiceSetting />
          </div>
        </div>
      </Context>
    </AdminLayout>
  );
};

export default EmployeesPage;

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

  return {
    props: {
      access_token: token,
    },
  };
}
