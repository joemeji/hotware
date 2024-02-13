import AdminLayout from "@/components/admin-layout";
import Client from "@/components/projects/project-page/ProjectDetails/Client";
import Layout from "@/components/projects/project-page/ProjectDetails/Layout";
import { AccessTokenContext } from "@/context/access-token-context";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export default function ClientPage({ access_token }: any) {
  return (
    <AdminLayout>
      <AccessTokenContext.Provider value={access_token}>
        <Layout render={(headerSize) => <Client headerSize={headerSize} />} />
      </AccessTokenContext.Provider>
    </AdminLayout>
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
