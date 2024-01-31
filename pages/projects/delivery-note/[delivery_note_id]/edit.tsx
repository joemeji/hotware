import AdminLayout from "@/components/admin-layout";
import EditDeliveryDetails from "@/components/projects/delivery-note/EditDeliveryDetails";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { authHeaders } from "@/utils/api.config";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getDeliveryNote } from "@/services/projects/delivery";

export default function EditDelivery({
  _delivery_note_id,
  delivery_note,
}: any) {
  return (
    <AdminLayout>
      <EditDeliveryDetails
        id={_delivery_note_id}
        delivery_note={delivery_note}
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

  if (!context?.params?.delivery_note_id) {
    return {
      redirect: {
        destination: "/projects/delivery-note",
        permanent: false,
      },
    };
  }

  const delivery_note = await getDeliveryNote(
    context.params.delivery_note_id as string,
    {
      headers: authHeaders(session.user.access_token),
    }
  );

  if (!delivery_note) {
    return {
      redirect: {
        destination: "/projects/delivery-note",
        permanent: false,
      },
    };
  }

  return {
    props: {
      _delivery_note_id: context.params.delivery_note_id,
      delivery_note,
    },
  };
}
