import AdminLayout from "@/components/admin-layout";
import Employees from "@/components/documents/employees/employees";
import Filter from "@/components/documents/employees/filter";
import List from "@/components/documents/employees/list";
import { AccessTokenContext } from "@/context/access-token-context";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import React, { useState } from "react";

export const EmployeeDocsContext = React.createContext(null);
export const SelectedEmployeeContext = React.createContext(null);

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
    <EmployeeDocsContext.Provider value={employee_docs}>
      <AccessTokenContext.Provider value={access_token}>
        <SelectedEmployeeContext.Provider value={selected_employee}>
          {children}
        </SelectedEmployeeContext.Provider>
      </AccessTokenContext.Provider>
    </EmployeeDocsContext.Provider>
  );
};

const EmployeesPage = ({ access_token }: any) => {
  const [filterHeight, setFilterHeight] = useState(0);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  return (
    <AdminLayout>
      <Context
        selected_employee={selectedEmployee}
        access_token={access_token}
        employee_docs={null}
      >
        <div className="pt-[20px] px-[20px] pb-[20px] w-full max-w-[1600px] mx-auto flex gap-3">
          <div className="flex gap-3 w-full">
            <div className="w-[25%] flex flex-col gap-[10px]">
              <Filter
                ref={(el: any) => {
                  const rect = el?.getBoundingClientRect();
                  let height = rect ? rect.height : 0;
                  setFilterHeight(height);
                }}
              />

              <Employees
                filterHeight={filterHeight}
                onClickEmployee={(user) => setSelectedEmployee(user)}
              />
            </div>
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
