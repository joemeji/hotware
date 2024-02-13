import AdminLayout from "@/components/admin-layout";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import React from "react";
import CreditDetails from "@/components/projects/credit-note/CreditDetails";
import CreditItemContent from "@/components/projects/credit-note/CreditItemContent";

export default function CreditView({ credit_note_id, user }: any) {
  const { data, isLoading, error } = useSWR(
    [`/api/projects/credits/details/${credit_note_id}`, user.access_token],
    fetchApi
  );

  return (
    <AdminLayout>
      <div className="p-[20px] w-full max-w-[1600px] mx-auto">
        <div className="flex gap-5">
          <CreditItemContent credit_note_id={credit_note_id} _data={data} />
          <CreditDetails data={data} />
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

  if (!context?.params?.credit_note_id) {
    return {
      redirect: {
        destination: "/projects/credit-note",
        permanent: false,
      },
    };
  }

  return {
    props: {
      credit_note_id: context.params.credit_note_id,
      user: session.user,
    },
  };
}
