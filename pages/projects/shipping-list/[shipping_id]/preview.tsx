import AdminLayout from "@/components/admin-layout";
import ShippingPreview from "@/components/projects/shipping-list/ShippingPreview";
import { AccessTokenContext } from "@/context/access-token-context";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { fetcher } from "@/utils/api.config";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { memo } from "react";
import useSWR from "swr";

const Preview = ({ access_token }: any) => {
  const router = useRouter();

  const { data, isLoading, error } = useSWR(`/api/shipping/${router.query.shipping_id}/details`, fetcher);

  console.log(data);

  return (
    <AccessTokenContext.Provider value={access_token}>
      <ShippingDetailsContext.Provider value={data}>
        <ShippingPreview />
      </ShippingDetailsContext.Provider>
    </AccessTokenContext.Provider>
  );
}

export default memo(Preview);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession( context.req, context.res, authOptions );

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  let user = session ? session.user : null;

  const access_token = user ? user.access_token : null;

  return {
    props: {
      access_token,
    },
  }
}