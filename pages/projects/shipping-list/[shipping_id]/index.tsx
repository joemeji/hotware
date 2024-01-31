import AdminLayout from "@/components/admin-layout";
import { ShippingDetails as ShippingDetailsWrapper } from "@/components/projects/shipping-list/shipping_id";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import useSWR from 'swr';
import { fetcher } from "@/utils/api.config";
import React from "react";
import { useRouter } from "next/router";
import ShippingDetails from "@/components/projects/shipping-list/ShippingDetails";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { AccessTokenContext } from "@/context/access-token-context";
import ShippingItemContent from "@/components/projects/shipping-list/ShippingItemContent";

export default function ShippingId({ access_token }: any) {
  const router = useRouter();

  const { 
    data: shippingData, 
    isLoading: shippingDataLoading, 
    error: shippingDataError 
  } = useSWR(`/api/shipping/${router.query.shipping_id}/details`, fetcher);

  return (
    <AccessTokenContext.Provider value={access_token}>
      <ShippingDetailsContext.Provider value={shippingData}>
        <AdminLayout>
          <ShippingDetailsWrapper>
            <ShippingItemContent access_token={access_token} />
            <ShippingDetails 
              access_token={access_token}
              details={{
                data: shippingData,
              }}
            />
          </ShippingDetailsWrapper>
        </AdminLayout>
      </ShippingDetailsContext.Provider>
    </AccessTokenContext.Provider>
  ); 
}
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession( context.req, context.res, authOptions );
  let token  = null;

  if (session && session.user) {
    token = session.user.access_token;
  } else {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: {
      access_token: token
    },
  }
}