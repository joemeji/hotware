"use client";

import AdminLayout from "@/components/admin-layout";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useSession, signOut } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";
import LoginDetails from "@/components/dashboard/LoginDetails";
import Social from "@/components/dashboard/Social";
import { AccessTokenContext } from "@/context/access-token-context";
import { useEffect, useRef } from "react";
import useSize from "@/hooks/useSize";
import MyProjectTask from "@/components/dashboard/MyProjectTask";
import dynamic from "next/dynamic";

dynamic;

const UpcomingProjects = dynamic(
  () => import("@/components/dashboard/UpcomingProjects")
);
const DueInvoices = dynamic(() => import("@/components/dashboard/DueInvoices"));
const Documents = dynamic(() => import("@/components/dashboard/Documents"));

export default function Home({ access_token, module_access }: any) {
  const socialRef = useRef(null);
  const uppRef = useRef(null);
  const socialSize: any = useSize(socialRef);
  const uppSize: any = useSize(uppRef);

  const leftLayoutMaxHeight = () => {
    if (socialSize?.height && uppSize?.height) {
      return socialSize.height + uppSize.height + 15;
    }
    return undefined;
  };

  useEffect(() => {
    if (uppRef.current) {
      const uppCurrent: any = uppRef.current;
      uppCurrent.style.setProperty(
        "--social-height",
        socialSize?.height + "px"
      );
    }
  }, [uppRef, socialSize]);

  return (
    <AdminLayout>
      <AccessTokenContext.Provider value={access_token}>
        <div className="pt-[20px] px-[20px] pb-[20px] w-full max-w-[1600px] mx-auto flex flex-wrap gap-4">
          <div className="flex gap-4 w-full">
            <MyProjectTask maxheight={leftLayoutMaxHeight()} />
            <div className="w-[65%] flex flex-col gap-[15px]">
              <div ref={socialRef} className="flex gap-4 w-full">
                <Social />
                <LoginDetails />
              </div>
              {/* {!module_access?.project && ( */}
              <div ref={uppRef}>
                <UpcomingProjects />
              </div>
              {/* )} */}
            </div>
          </div>
          <div className="flex gap-4 w-full">
            {/* {!module_access?.document && ( */}
            <div className="w-1/2">
              <Documents />
            </div>
            {/* )} */}

            {/* {!module_access?.invoice && ( */}
            <div className="w-1/2">
              <DueInvoices />
            </div>
            {/* )} */}
          </div>
        </div>
      </AccessTokenContext.Provider>
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
      module_access: session?.user?.module_access,
    },
  };
}
