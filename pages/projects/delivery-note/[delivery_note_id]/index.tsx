import AdminLayout from "@/components/admin-layout";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import React from "react";
import DeliveryDetails from "@/components/projects/delivery-note/DeliveryDetails";
import DeliveryItemContent from "@/components/projects/delivery-note/DeliveryItemContent";

export default function DeliveryView({ delivery_note_id, user }: any) {
  const { data, isLoading, error } = useSWR(
    [`/api/projects/deliveries/details/${delivery_note_id}`, user.access_token],
    fetchApi
  );

  return (
    <AdminLayout>
      <div className="p-[20px] w-full max-w-[1600px] mx-auto">
        <div className="flex gap-5">
          <DeliveryItemContent delivery_note_id={delivery_note_id} />
          <DeliveryDetails data={data} />
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

  if (!context?.params?.delivery_note_id) {
    return {
      redirect: {
        destination: "/projects/delivery-note",
        permanent: false,
      },
    };
  }

  return {
    props: {
      delivery_note_id: context.params.delivery_note_id,
      user: session.user,
    },
  };
}
