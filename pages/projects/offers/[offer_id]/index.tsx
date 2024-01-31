import AdminLayout from "@/components/admin-layout";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import useSWR from "swr";
import { fetchApi } from "@/utils/api.config";
import React from "react";
import OfferDetails from "@/components/projects/offers/OfferDetails";
import OfferItemContent from "@/components/projects/offers/OfferItemContent";

export default function OfferView({ offer_id, user }: any) {
  const { data, isLoading, error } = useSWR(
    [`/api/projects/offers/details/${offer_id}`, user.access_token],
    fetchApi
  );

  return (
    <AdminLayout>
      <div className="p-[20px] w-full max-w-[1600px] mx-auto">
        <div className="flex gap-5">
          <OfferItemContent
            offer_id={offer_id}
            currency={data?.currency_sign}
            _data={data}
          />
          <OfferDetails data={data} />
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

  if (!context?.params?.offer_id) {
    return {
      redirect: {
        destination: "/projects/offers",
        permanent: false,
      },
    };
  }

  return {
    props: {
      offer_id: context.params.offer_id,
      user: session.user,
    },
  };
}
