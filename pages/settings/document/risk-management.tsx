import AdminLayout from "@/components/admin-layout";
import { SettingsLanguage } from "@/components/settings/document/language";
import { SettingsRiskManagement } from "@/components/settings/document/risk-management";
import { AccessTokenContext } from "@/context/access-token-context";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export default function RiskManagement({ accessToken }: any) {
  return (
    <AdminLayout>
      <AccessTokenContext.Provider value={accessToken}>
        <SettingsRiskManagement />
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
