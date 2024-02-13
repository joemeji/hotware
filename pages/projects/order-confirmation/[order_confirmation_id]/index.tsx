import AdminLayout from "@/components/admin-layout";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import React from "react";
import OrderDetails from "@/components/projects/order-confirmation/OrderDetails";
import OrderItemContent from "@/components/projects/order-confirmation/OrderItemContent";

export default function OrderView({ order_confirmation_id, user }: any) {
  const { data, isLoading, error } = useSWR(
    [
      `/api/projects/orders/details/${order_confirmation_id}`,
      user.access_token,
    ],
    fetchApi
  );

  return (
    <AdminLayout>
      <div className="p-[20px] w-full max-w-[1600px] mx-auto">
        <div className="flex gap-5">
          <OrderItemContent
            order_confirmation_id={order_confirmation_id}
            _data={data}
          />
          <OrderDetails data={data} />
        </div>
      </div>
    </AdminLayout>
  );
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.access_token) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  if (!context?.params?.order_confirmation_id) {
    return {
      redirect: {
        destination: "/projects/order-confirmation",
        permanent: false,
      },
    };
  }

  return {
    props: {
      order_confirmation_id: context.params.order_confirmation_id,
      user: session.user,
    },
  };
}
