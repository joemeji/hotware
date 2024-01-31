import AdminLayout from "@/components/admin-layout";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { AccessTokenContext } from "@/context/access-token-context";
import LetterCategoryLists from "@/components/admin-pages/letter-category/lists/LetterCategoryLists";

export default function CreateCompanyLetters({ accessToken }: any) {

  return (
    <AdminLayout>
      <AccessTokenContext.Provider value={accessToken}>
        <div className="p-[20px] w-full max-w-[1600px] mx-auto">
          <div className='flex py-5 justify-between'>
            <h2 className="uppercase">Category</h2>
          </div>
          <div className="rounded-xl bg-white mt-4 shadow-sm flex flex-col min-h-[600px]">
            <div className='p-7'>
              <div className="flex justify-between mb-4 flex-col">
                <h1 className="text-2xl font-light mb-5">Manage Category</h1>
                <LetterCategoryLists />
              </div>
            </div>
          </div>
        </div>
      </AccessTokenContext.Provider>
    </AdminLayout>
  )
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


