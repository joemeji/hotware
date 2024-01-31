import Company, {
  ContainerDialog,
} from "@/components/address-manager/details/Company";
import Contact from "@/components/address-manager/details/Contact";
import AdminLayout from "@/components/admin-layout";
import { AccessTokenContext } from "@/context/access-token-context";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { fetcher } from "@/utils/api.config";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import React, { createContext, memo, useRef, useState } from "react";
import useSWR from "swr";
import useSize from "@/hooks/useSize";

export const CmsDetailsContext = React.createContext(null);
export const LoadingContext = React.createContext(false);

export const ContactContainerSizeContext = createContext(null);
export const ContainerSizeContext = createContext(null);

const CmsDetails = ({ access_token }: any) => {
  const router = useRouter();
  const contactContainerRef = useRef(null);
  const contactContainerSize: any = useSize(contactContainerRef);
  const containerRef = useRef(null);
  const containerSize: any = useSize(containerRef);
  const [viewDetails, setViewDetails] = useState(false);

  let { data, isLoading, error } = useSWR(
    `/api/cms/${router.query.cms_id}`,
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateIfStale: false,
    }
  );

  return (
    <AccessTokenContext.Provider value={access_token}>
      <AdminLayout>
        <LoadingContext.Provider value={isLoading}>
          <CmsDetailsContext.Provider value={data}>
            <ContainerSizeContext.Provider value={containerSize}>
              <div
                ref={containerRef}
                className="pt-[20px] px-[20px] pb-[20px] w-full max-w-[1600px] mx-auto flex gap-3"
              >
                <ContactContainerSizeContext.Provider
                  value={contactContainerSize}
                >
                  <div
                    className="w-[75%]"
                    ref={contactContainerRef}
                    style={{
                      width: containerSize?.width < 1000 ? "100%" : "75%",
                    }}
                  >
                    <Contact onViewDetails={() => setViewDetails(true)} />
                  </div>
                </ContactContainerSizeContext.Provider>

                <ContainerDialog
                  open={viewDetails}
                  onOpenChange={(open: any) => setViewDetails(open)}
                  showSheet={containerSize?.width < 1000}
                >
                  <div
                    style={{
                      width: containerSize?.width < 1000 ? "100%" : "25%",
                    }}
                  >
                    <Company />
                  </div>
                </ContainerDialog>
              </div>
            </ContainerSizeContext.Provider>
          </CmsDetailsContext.Provider>
        </LoadingContext.Provider>
      </AdminLayout>
    </AccessTokenContext.Provider>
  );
};

export default memo(CmsDetails);

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
