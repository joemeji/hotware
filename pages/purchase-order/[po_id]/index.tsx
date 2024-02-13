import AdminLayout from "@/components/admin-layout";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import React from "react";
import PurchaseDetails from "@/components/PurchaseOrder/PurchaseDetails";
import PurchaseItemContent from "@/components/PurchaseOrder/PurchaseItemContent";

export default function PurchaseView({ po_id, user }: any) {
  const { data, isLoading, error } = useSWR(
    [`/api/purchases/details/${po_id}`, user.access_token],
    fetchApi
  );

  return (
    <AdminLayout>
      <div className="p-[20px] w-full max-w-[1600px] mx-auto">
        <div className="flex gap-5">
          <PurchaseItemContent po_id={po_id} _data={data} />
          <PurchaseDetails data={data} />
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

  if (!context?.params?.po_id) {
    return {
      redirect: {
        destination: "/purchase-order",
        permanent: false,
      },
    };
  }

  return {
    props: {
      po_id: context.params.po_id,
      user: session.user,
    },
  };
}
