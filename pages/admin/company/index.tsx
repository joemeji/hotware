import AdminLayout from "@/components/admin-layout";
import { ListView } from "@/components/admin-pages/company";
import Pagination from "@/components/pagination";
import { Button } from "@/components/ui/button";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { fetchApi } from "@/utils/api.config";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { useRouter } from "next/router";
import useSWR from "swr";

export default function Companies({ accessToken }: any) {
  const router = useRouter();

  const payload: any = {};
  if (router.query.page) payload["page"] = router.query.page;
  const queryString = new URLSearchParams(payload).toString();

  const { data, isLoading } = useSWR(
    [`/api/admin/companies?${queryString}`, accessToken],
    fetchApi,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  const onEdit = (id: string) => {
    router.push(`company/${id}/edit`);
  };

  const onDelete = (id: string) => {
    // TODO: Do something when delete menu is clicked
  };

  const onPaginate = (page: number) => {
    router.query.page = `${page}`;
    router.push(router);
  };

  return (
    <AdminLayout>
      <div className="p-[20px] w-full max-w-[1600px] mx-auto">
        <div className="rounded-xl bg-white mt-4 shadow-sm flex flex-col min-h-[600px]">
          <div className="flex justify-between m-4">
            <h1 className="text-2xl font-medium">Companies</h1>
            <Link href="/admin/company/create">
              <Button>Add Company</Button>
            </Link>
          </div>
          <ListView
            isLoading={isLoading}
            data={data?.companies ?? []}
            onEdit={(id) => onEdit(id)}
            onDelete={(id) => onDelete(id)}
          />
          {data?.pager && (
            <div className="mt-auto border-t border-t-stone-100">
              <Pagination
                pager={data.pager}
                onPaginate={(page) => onPaginate(page)}
              />
            </div>
          )}
        </div>
      </div>
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

  return {
    props: {
      accessToken: session.user.access_token,
    },
  };
}
