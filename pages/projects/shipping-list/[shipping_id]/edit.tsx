import AdminLayout from "@/components/admin-layout";
import { cmsUri } from "@/components/app/cms-select";
import EditShippingDetails from "@/components/projects/shipping-list/EditShippingDetails";
import { AccessTokenContext, SettingsContext } from "@/context/access-token-context";
import { ShippingDetailsContext } from "@/context/shipping-details-context";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { fetcher } from "@/utils/api.config";
import { getSettings } from "@/utils/getSettings";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Head from "next/head";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function EditShippingList({ access_token, settings }: any) {
  const router = useRouter();

  const { data, isLoading, error } = useSWR(`/api/shipping/${router.query.shipping_id}/details`, fetcher);

  return (
    <>
      <Head>
      <link rel="preload" href={cmsUri({ index: 0, shipping_id: router.query.shipping_id })} as="fetch" crossOrigin="anonymous" />
      </Head>
      <SettingsContext.Provider value={settings}>
        <AccessTokenContext.Provider value={access_token}>
          <ShippingDetailsContext.Provider value={data}>
            <AdminLayout>
              {isLoading && <p className="p-3">Loading...</p>}
              {!isLoading && <EditShippingDetails />}
            </AdminLayout>
        </ShippingDetailsContext.Provider>
        </AccessTokenContext.Provider>
      </SettingsContext.Provider>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession( context.req, context.res, authOptions );
  let token = null;

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

  const settings = await getSettings(token);
  
  return {
    props: {
      settings,
      access_token: token
    },
  }
}