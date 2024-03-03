import { SerialNumberTab } from "@/components/items/itemId/SerialNumberTab";
import Layout from "@/components/items/itemId/Layout";
import { AccessTokenContext } from "@/context/access-token-context";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export default function Page({ access_token, currencies }: any) {
  return (
    <AccessTokenContext.Provider value={access_token}>
      <Layout>
        <SerialNumberTab />
      </Layout>
    </AccessTokenContext.Provider>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  let token = null;

  if (session && session.user) {
    token = session.user.access_token;
  } else {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      access_token: token,
    },
  };
}
