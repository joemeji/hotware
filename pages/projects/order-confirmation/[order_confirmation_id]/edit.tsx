import AdminLayout from "@/components/admin-layout";
import EditOrderDetails from "@/components/projects/order-confirmation/EditOrderDetails";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { authHeaders } from "@/utils/api.config";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getOrderConfirmation } from "@/services/projects/order";

export default function EditOrder({
  _order_confirmation_id,
  order_confirmation,
}: any) {
  return (
    <AdminLayout>
      <EditOrderDetails
        id={_order_confirmation_id}
        order_confirmation={order_confirmation}
      />
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

  if (!context?.params?.order_confirmation_id) {
    return {
      redirect: {
        destination: "/projects/order-confirmation",
        permanent: false,
      },
    };
  }

  const order_confirmation = await getOrderConfirmation(
    context.params.order_confirmation_id as string,
    {
      headers: authHeaders(session.user.access_token),
    }
  );

  if (!order_confirmation) {
    return {
      redirect: {
        destination: "/projects/order-confirmation",
        permanent: false,
      },
    };
  }

  return {
    props: {
      _order_confirmation_id: context.params.order_confirmation_id,
      order_confirmation,
    },
  };
}
