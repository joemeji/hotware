import AdminLayout from "@/components/admin-layout";
import { SettingsHoliday } from "@/components/settings/general/holiday";
import { AccessTokenContext } from "@/context/access-token-context";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export default function Holiday({accessToken} : any) {

  return (
    <AdminLayout>
      <AccessTokenContext.Provider value={accessToken}>
        <SettingsHoliday />
      </AccessTokenContext.Provider>
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

  return {
    props: {
      accessToken: session.user.access_token,
    },
  };
}