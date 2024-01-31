import AdminLayout from "@/components/admin-layout";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";
import { AccessTokenContext } from "@/context/access-token-context";
import { useState } from "react";
import SignatoryLists from "@/components/admin-pages/company-letters/lists/SignatoryLists";
import AddSignatoryModal from "@/components/admin-pages/company-letters/modals/AddSignatoryModal";

export default function CreateCompanyLetters({ accessToken }: any) {

  const [addSignatoryModal, setAddSignatoryModal] = useState(false)


  return (
    <AdminLayout>
      <AccessTokenContext.Provider value={accessToken}>
        <AddSignatoryModal
          open={addSignatoryModal}
          onOpenChange={(open: any) => setAddSignatoryModal(open)}
        />
        <div className="p-[20px] w-full max-w-[1600px] mx-auto">
          <div className='flex py-5 justify-between'>
            <h2 className="uppercase">Signatory</h2>
            <div className="flex gap-3 items-center">
              <div>
                <Button
                  className="bg-red-600 hover:bg-red-500"
                  onClick={() => setAddSignatoryModal(true)}
                >
                  <Plus size={16} strokeWidth={2.25} absoluteStrokeWidth />
                  New Signatory
                </Button>
              </div>
            </div>
          </div>
          <div className="rounded-xl bg-white mt-4 shadow-sm flex flex-col min-h-[600px]">
            <div className='p-7'>
              <div className="flex justify-between mb-4 flex-col">
                <h1 className="text-2xl font-light mb-5">Manage Signatory</h1>
                <SignatoryLists />
              </div>
            </div>
          </div>
        </div>
      </AccessTokenContext.Provider>
    </AdminLayout>
  )

}


const Skeleton = () => {
  return <Loader className="animate-spin text=center mx-auto" />
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


