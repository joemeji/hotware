import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]";
import AdminLayout from "@/components/admin-layout";
import { AccessTokenContext } from "@/context/access-token-context";
import EditProjectPage from "@/components/projects/project-page/EditProject";

const EditProject = ({ access_token }: any) => {
  return (
    <>
      <AdminLayout>
        <AccessTokenContext.Provider value={access_token}>
          <EditProjectPage />
        </AccessTokenContext.Provider>
      </AdminLayout>
    </>
  );
};

export default EditProject;

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
