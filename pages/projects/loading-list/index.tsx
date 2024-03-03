import AdminLayout from "@/components/admin-layout";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { SearchContent } from "@/components/LoadingList/LoadingDetails/search-content";
import { LoadingListHeader } from "@/components/LoadingList/LoadingDetails/loading-list-header";
import { LoadingListItem } from "@/components/LoadingList/LoadingDetails/loading-list-item";
import LoadingListDetail from "@/components/LoadingList/LoadingDetails/loading-list-detail";
import React, { useState } from "react";
import { AddNewLoadingListModal } from "@/components/LoadingList/modals/AddNewLoadingListModal";
import { getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import LoadingList from "@/components/LoadingList/LoadingDetails/loading-list";
import { AccessTokenContext } from "@/context/access-token-context";
import { Search, X } from "lucide-react";
import { useRouter } from "next/router";
import { useRouter as useRouterNav } from "next/navigation";
import { Input } from "@/components/ui/input";

export const LoadingListDetailsContext = React.createContext(null);

export default function LoadingListPage(token: any) {
  const router = useRouter();
  const { push } = useRouterNav();
  const [success, setSuccess] = useState(false);

  const [addNewLoadingListModal, setNewLoadingListModal] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(null);

  const handleSetLoadingDetails = (loadingDetails: any) => {
    setLoadingDetails(loadingDetails);
  };

  return (
    <AdminLayout>
      <AccessTokenContext.Provider value={token.access_token}>
        <div className="p-[20px] w-full max-w-[1600px] mx-auto flex gap-3 ">
          <div className="bg-white rounded-xl shadow overflow-hidden w-[400px]">
            <div className="flex flex-col">
              <LoadingList
                onClickItem={(loading: any) => handleSetLoadingDetails(loading)}
                access_token={token.access_token}
                onSuccess={success}
              />
            </div>
          </div>
          <div
            className={`bg-white rounded-app shadow-sm h-[calc(100vh-var(--header-height)-40px)] max-h-screen overflow-hidden w-[calc(100%-400px)] transition-width duration-300 ease-in-out`}
          >
            <LoadingListDetailsContext.Provider value={loadingDetails}>
              <LoadingListHeader />
            </LoadingListDetailsContext.Provider>
            <ScrollArea viewPortClassName="h-[calc(100vh-var(--header-height)-40px)]">
              <LoadingListDetailsContext.Provider value={loadingDetails}>
                <LoadingListItem />
              </LoadingListDetailsContext.Provider>
            </ScrollArea>
          </div>
        </div>
      </AccessTokenContext.Provider>
    </AdminLayout>
  );
}

export const TH = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => (
  <td
    className={cn(
      "py-3 px-2 text-sm bg-stone-200 text-stone-600 font-medium",
      className
    )}
  >
    {children}
  </td>
);

export const TD = ({
  className,
  children,
  image,
}: {
  className?: string;
  children?: React.ReactNode;
  image: React.ReactNode;
}) => (
  <td
    className={cn(
      "py-2 px-2 border-b border-b-stone-100 group-last:border-0",
      className
    )}
  >
    <div className="flex items-center gap-2">
      {image} {children}
    </div>
  </td>
);

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
