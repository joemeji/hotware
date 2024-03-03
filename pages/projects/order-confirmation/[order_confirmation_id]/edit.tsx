import AdminLayout from "@/components/admin-layout";
import EditOrderDetails from "@/components/projects/order-confirmation/EditOrderDetails";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { authHeaders } from "@/utils/api.config";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getOrderConfirmation } from "@/services/projects/order";
import { AccessTokenContext } from "@/context/access-token-context";

export default function EditOrder({
  _order_confirmation_id,
  order_confirmation,
  access_token,
}: any) {
  return (
    <AdminLayout>
      <AccessTokenContext.Provider value={access_token}>
        <EditOrderDetails
          id={_order_confirmation_id}
          order_confirmation={order_confirmation}
        />
      </AccessTokenContext.Provider>
    </AdminLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  let token = null;
  if (!session?.user?.access_token) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  } else {
    token = session?.user?.access_token;
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
      access_token: token,
    },
  };
}
