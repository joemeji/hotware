import AdminLayout from "@/components/admin-layout";
import EditPurchaseDetails from "@/components/PurchaseOrder/EditPurchaseDetails";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { authHeaders } from "@/utils/api.config";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getPurchaseOrder } from "@/services/purchase";

export default function EditDelivery({ _po_id, po }: any) {
  return (
    <AdminLayout>
      <EditPurchaseDetails id={_po_id} purchase_order={po} />
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

  if (!context?.params?.po_id) {
    return {
      redirect: {
        destination: "/purchase-order",
        permanent: false,
      },
    };
  }

  const po = await getPurchaseOrder(context.params.po_id as string, {
    headers: authHeaders(session.user.access_token),
  });

  if (!po) {
    return {
      redirect: {
        destination: "/purchase-order",
        permanent: false,
      },
    };
  }

  return {
    props: {
      _po_id: context.params.po_id,
      po,
    },
  };
}
