import AdminLayout from "@/components/admin-layout";
import { SettingsLanguage } from "@/components/settings/document/language";
import { SettingsTextBlock } from "@/components/settings/document/text-block";
import { AccessTokenContext } from "@/context/access-token-context";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export default function TextBlock({ accessToken }: any) {
  return (
    <AdminLayout>
      <AccessTokenContext.Provider value={accessToken}>
        <SettingsTextBlock />
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
