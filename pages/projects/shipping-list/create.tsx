import AdminLayout from "@/components/admin-layout";
import CreateShippingDetails from "@/components/projects/shipping-list/CreateShippingDetails";
import { SettingsContext } from "@/context/access-token-context";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { getSettings } from "@/utils/getSettings";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export default function CreateShipping({ settings }: any) {

  return (
    <>
      <SettingsContext.Provider value={settings}>
        <AdminLayout>
          <CreateShippingDetails />
        </AdminLayout>
      </SettingsContext.Provider>
    </>
  );
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
    },
  }
}