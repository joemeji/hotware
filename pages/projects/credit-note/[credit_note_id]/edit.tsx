import AdminLayout from "@/components/admin-layout";
import EditCreditDetails from "@/components/projects/credit-note/EditCreditDetails";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { authHeaders } from "@/utils/api.config";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getCreditNote } from "@/services/projects/credit";

export default function EditCredit({ _credit_note_id, credit_note }: any) {
  return (
    <AdminLayout>
      <EditCreditDetails id={_credit_note_id} credit_note={credit_note} />
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

  if (!context?.params?.credit_note_id) {
    return {
      redirect: {
        destination: "/projects/credit-note",
        permanent: false,
      },
    };
  }

  const credit_note = await getCreditNote(
    context.params.credit_note_id as string,
    {
      headers: authHeaders(session.user.access_token),
    }
  );

  if (!credit_note) {
    return {
      redirect: {
        destination: "/projects/credit-note",
        permanent: false,
      },
    };
  }

  return {
    props: {
      _credit_note_id: context.params.credit_note_id,
      credit_note,
    },
  };
}
