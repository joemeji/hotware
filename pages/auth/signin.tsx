"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { getCsrfToken, signIn } from "next-auth/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

export default function Signin({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex h-[100vh]">
      <div  className="h-full w-1/2 bg-[url('/images/login-bg.jpg')] bg-center" />
      <div className="w-1/2 h-full bg-white flex justify-center items-center p-4">
        <div className="flex w-full max-w-[400px]">
          <FormLogin csrfToken={csrfToken} />
        </div>
      </div>
    </div>
  )
}

const FormLogin = ({ csrfToken }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [email, setEmail] = useState<any>('joemy.flores@hotwork.asia');
  // const [password, setPassword] = useState<any>('jay@21Flo');
  const [password, setPassword] = useState<any>('_Jow@21Flow');
  
  const onSignin = async (e: React.FormEvent) => {
    e.preventDefault();

    signIn('credentials', { email, password, csrfToken });
  }

  return (
    <form action="/api/auth/callback/credentials" className="w-full" onSubmit={onSignin}>
      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <div className="mb-3">
        <label>Email Address</label>
        <Input type="email" placeholder="name@example.com" 
          value={email || ''}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label>Password</label>
        <Input type="password" placeholder="Password" 
          value={password || ''}
          onChange={e => setPassword(e.target.value)}
        />
      </div>
      <Button type="submit">Login</Button>
    </form>
  )
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession( context.req, context.res, authOptions );

  if (session && session.user) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}