import AdminLayout from "@/components/admin-layout";
import EditOfferDetails from "@/components/projects/offers/EditOfferDetails";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { authHeaders } from "@/utils/api.config";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getOffer } from "@/services/projects/offer";

export default function EditOffer({ _offer_id, offer }: any) {
  return (
    <AdminLayout>
      <EditOfferDetails id={_offer_id} offer={offer} />
    </AdminLayout>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession( context.req, context.res, authOptions );

  if (!session?.user?.access_token) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  if (!context?.params?.offer_id) {
    return {
      redirect: {
        destination: '/projects/offers',
        permanent: false,
      },
    }
  }

  const offer = await getOffer(context.params.offer_id as string, {
    headers: authHeaders(session.user.access_token)
  });

  if (!offer) {
    return {
      redirect: {
        destination: '/projects/offers',
        permanent: false,
      },
    }
  }

  return {
    props: {
      _offer_id: context.params.offer_id,
      offer
    },
  }
}