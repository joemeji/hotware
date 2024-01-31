import AdminLayout from "@/components/admin-layout";
import CreateOfferDetails from "@/components/projects/offers/CreateOfferDetails";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export default function CreateOffer() {
  return (
    <>
      <AdminLayout>
        <CreateOfferDetails />
      </AdminLayout>
    </>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession( context.req, context.res, authOptions );
  let token = null;

  if (session && session.user) {
    token = session.user.access_token;
  } else {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  return { props: {} };
}