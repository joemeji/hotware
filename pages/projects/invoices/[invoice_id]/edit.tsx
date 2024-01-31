import AdminLayout from "@/components/admin-layout";
import EditInvoiceDetails from "@/components/projects/invoices/EditInvoiceDetails";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { authHeaders } from "@/utils/api.config";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getInvoice } from "@/services/projects/invoice";

export default function Editinvoice({ _invoice_id, invoice }: any) {
  return (
    <AdminLayout>
      <EditInvoiceDetails id={_invoice_id} invoice={invoice} />
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

  if (!context?.params?.invoice_id) {
    return {
      redirect: {
        destination: "/projects/invoices",
        permanent: false,
      },
    };
  }

  const invoice = await getInvoice(context.params.invoice_id as string, {
    headers: authHeaders(session.user.access_token),
  });

  if (!invoice) {
    return {
      redirect: {
        destination: "/projects/invoices",
        permanent: false,
      },
    };
  }

  return {
    props: {
      _invoice_id: context.params.invoice_id,
      invoice,
    },
  };
}
