import { CodificationTab } from "@/components/items/itemId/CodificationTab";
import PricesTab from "@/components/items/itemId/PriceTab";
import Layout from "@/components/items/itemId/Layout";
import { AccessTokenContext } from "@/context/access-token-context";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { baseUrl } from "@/utils/api.config";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export default function Page({ access_token, currencies }: any) {
  return (
    <AccessTokenContext.Provider value={access_token}>
      <Layout>
        <PricesTab currencies={currencies} />
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

  let res = await fetch(baseUrl + "/currencies");
  const currencies = await res.json();

  return {
    props: {
      access_token: token,
      currencies,
    },
  };
}
