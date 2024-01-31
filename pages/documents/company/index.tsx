import AdminLayout from "@/components/admin-layout";
import List from "@/components/documents/company/List";
import Employees from "@/components/documents/employees/employees";
import Filter from "@/components/documents/employees/filter";
import { AccessTokenContext } from "@/context/access-token-context";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import React, { useState } from "react";

export const EmployeeDocsContext = React.createContext(null);
export const SelectedEmployeeContext = React.createContext(null);

const Context = ({
  children,
  access_token,
}: {
  children: React.ReactNode;
  access_token?: any;
}) => {
  return (
    <AccessTokenContext.Provider value={access_token}>
      {children}
    </AccessTokenContext.Provider>
  );
};

const EmployeesPage = ({ access_token }: any) => {
  const [filterHeight, setFilterHeight] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  return (
    <AdminLayout>
      <Context
        access_token={access_token}
      >
        <div className="pt-[20px] px-[20px] pb-[20px] w-full max-w-[1600px] mx-auto flex gap-3">
          <div className="flex gap-3 w-full">
            <List />
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
