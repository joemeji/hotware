import AdminLayout from "@/components/admin-layout";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { authHeaders } from "@/utils/api.config";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import EditUserDetails from "@/components/admin-pages/users/userId/edit-user-details";
import { getUserDetails } from "@/services/admin/user";

export default function EditUser({ user_id, user }: any) {
  return (
    <AdminLayout>
      <EditUserDetails id={user_id} user={user} />
    </AdminLayout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.access_token) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  if (!context?.params?.user_id) {
    return {
      redirect: {
        destination: '/admin/users/index',
        permanent: false,
      },
    }
  }

  const user = await getUserDetails(context.params.user_id as string, {
    headers: authHeaders(session.user.access_token)
  });

  if (!user) {
    return {
      redirect: {
        destination: '/admin/users/index',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user_id: context.params.user_id,
      user
    },
  }
}