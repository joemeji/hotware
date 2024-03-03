import ListView from "@/components/projects/delivery-note/ListView";
import DocumentLayout from "@/components/projects/project-page/ProjectDetails/Documents/DocumentLayout";
import { AccessTokenContext } from "@/context/access-token-context";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";

export default function DeliveryNote({ access_token }: any) {
  const router = useRouter();
  return (
    <AccessTokenContext.Provider value={access_token}>
      <DocumentLayout
        render={(headerSize: any) => (
          <ListView
            access_token={access_token}
            _project_id={router.query.project_id}
            onProject={true}
          />
        )}
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
