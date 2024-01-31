import AdminLayout from "@/components/admin-layout";
import EditCompanyForm from "@/components/admin-pages/company/edit";
import { Company } from "@/components/admin-pages/company/schema";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";

export default function EditCompany({ id, company }: any) {
  return (
    <AdminLayout>
      <EditCompanyForm id={id} company={company} />
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

  if (!context?.params?.companyId) {
    return {
      redirect: {
        destination: "/admin/company",
        permanent: false,
      },
    };
  }

  const companyId = context.params.companyId;
  let company: Company | null;
  try {
    const response = await fetch(
      `${baseUrl}/api/admin/companies/details/${companyId}`,
      {
        headers: authHeaders(session.user.access_token),
      }
    );
    company = await response.json();
  } catch (error) {
    company = null;
  }

  if (!company) {
    return {
      redirect: {
        destination: "/admin/company",
        permanent: false,
      },
    };
  }

  return {
    props: {
      id: companyId,
      company: company,
    },
  };
}
