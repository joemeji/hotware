import AdminLayout from "@/components/admin-layout";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import React from "react";
import InvoiceDetails from "@/components/projects/invoices/InvoiceDetails";
import InvoiceItemContent from "@/components/projects/invoices/InvoiceItemContent";

export default function OfferView({ invoice_id, user }: any) {
  const { data, isLoading, error } = useSWR(
    [`/api/projects/invoices/details/${invoice_id}`, user.access_token],
    fetchApi
  );

  return (
    <AdminLayout>
      <div className="p-[20px] w-full max-w-[1600px] mx-auto">
        <div className="flex gap-5">
          <InvoiceItemContent invoice_id={invoice_id} />
          <InvoiceDetails data={data} />
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

  if (!context?.params?.invoice_id) {
    return {
      redirect: {
        destination: "/projects/invoices",
        permanent: false,
      },
    };
  }

  return {
    props: {
      invoice_id: context.params.invoice_id,
      user: session.user,
    },
  };
}
