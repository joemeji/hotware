import AdminLayout from "@/components/admin-layout";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { createContext } from "react";
import ListView from "@/components/projects/shipping-list/ListView";

export const ShippingListContainerSizeContext = createContext(null);

export default function ShippingList({ access_token }: any) {
  return (
    <AdminLayout>
      <div className="p-[20px] w-full max-w-[1600px] mx-auto">
        <ListView access_token={access_token} />
      </div>
    </AdminLayout>
  );
}

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
