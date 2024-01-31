import AdminLayout from "@/components/admin-layout";
import CreatePurchaseDetails from "@/components/PurchaseOrder/CreatePurchaseDetails";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export default function CreatePurchase() {
  return (
    <>
      <AdminLayout>
        <CreatePurchaseDetails />
      </AdminLayout>
    </>
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

  return { props: {} };
}
