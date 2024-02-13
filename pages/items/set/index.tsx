import React, { useState } from "react";
import AdminLayout from "@/components/admin-layout";
import Set from "@/components/items/set";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { AddPredefinedSetsModal } from "@/components/items/set/modals";

export default function Index({ access_token }: any) {
  const [AddPredefinedSetsModalClose, isModalOpen] = useState(false);

  const addPredefinedSets = () => {
    isModalOpen(true);
  };

  return (
    <AdminLayout>
      <AddPredefinedSetsModal
        open={AddPredefinedSetsModalClose}
        onOpenChange={(open: any) => isModalOpen(open)}
      />
      <div className="pt-[20px] px-[20px] pb-[20px] w-full max-w-[1600px] mx-auto flex gap-3">
        <div className="w-full h-full">
          <ScrollArea
            className="flex flex-col"
            viewPortClassName="min-h-[400px] rounded-app bg-white"
            viewPortStyle={{
              height: `calc(100vh - var(--header-height) - 40px)`,
            }}
          >
            <div className="flex w-full flex-col backdrop-blur-sm bg-white/90 z-10 sticky top-0 rounded-t-app">
              <div
                className={cn(
                  "p-3 flex justify-between items-center",
                  "border-b border-b-stone-100"
                )}
              >
                <span className="text-lg font-medium">Predefined Sets</span>
                <form>
                  <Input
                    type="search"
                    placeholder="Search"
                    className="rounded-xl placeholder:text-stone-400 w-[400px]"
                    name="search"
                  />
                </form>
                <Button
                  className="gap-1"
                  variant="secondary"
                  onClick={addPredefinedSets}
                >
                  <Plus className="w-[18px] h-[18px] text-red-600" />
                  Add Predefined Sets
                </Button>
              </div>
            </div>
            <Set />
          </ScrollArea>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  let token = null;

  if (session && session.user) {
    token = session.user.access_token;
  } else {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: {
      access_token: token,
    },
  };
}
