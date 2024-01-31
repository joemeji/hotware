'use client';

import AdminLayout from "@/components/admin-layout";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useSession, signOut } from "next-auth/react";
import { authOptions } from "./api/auth/[...nextauth]";

export default function Home() {
  const { data: session, status: authStatus } = useSession();

  console.log(session);

  return (
    <AdminLayout>
      <h1 onClick={() => signOut()} className="text-center">Dashboard coming soon.</h1>
    </AdminLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession( context.req, context.res, authOptions );
  let token  = null;

  if (session && session.user) {
    token = session.user.access_token;
  } else {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: {
      access_token: token,
    },
  }
}