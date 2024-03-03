import DocumentLayout from "@/components/projects/project-page/ProjectDetails/Documents/DocumentLayout";
import RiskManagementDocument from "@/components/projects/project-page/ProjectDetails/Documents/RiskManagementDocument";
import { AccessTokenContext } from "@/context/access-token-context";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export default function RiskManagement({ access_token }: any) {
  return (
    <AccessTokenContext.Provider value={access_token}>
      <DocumentLayout
        render={(headerSize: any) => <RiskManagementDocument />}
      />
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
