"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { getCsrfToken, signIn } from "next-auth/react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import { cn } from "@/lib/utils";
import Image from "next/image";

const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "tablet";
  }
  if (
    /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
      ua
    )
  ) {
    return "mobile";
  }
  return "desktop";
};

export default function Signin({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div className="flex h-[100vh] bg-stone-200 items-center justify-center">
      <FormLogin csrfToken={csrfToken} />
      {/* <div className="h-full w-1/2 bg-[url('/images/login-bg.jpg')] bg-center" />
      <div className="w-1/2 h-full bg-white flex justify-center items-center p-4">
        <div className="flex w-full max-w-[400px]">
          
        </div>
      </div> */}
    </div>
  );
}

const FormLogin = ({
  csrfToken,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [email, setEmail] = useState<any>("");
  // const [email, setEmail] = useState<any>("dev@hotwork.asia");
  // const [password, setPassword] = useState<any>('_Jow@21Flow');
  const [password, setPassword] = useState<any>("");
  const [loading, setLoading] = useState(false);

  const onSignin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    await signIn("credentials", {
      email,
      password,
      csrfToken,
      device: getDeviceType(),
    });

    setLoading(false);
  };

  return (
    <form
      action="/api/auth/callback/credentials"
      className="w-full max-w-[400px] bg-white shadow px-4 py-7 flex flex-col gap-4 items-center"
      onSubmit={onSignin}
    >
      <div className="mb-5">
        <Image
          src="/logos/main-logo-black.svg"
          width={200}
          height={200}
          alt=""
        />
      </div>

      <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
      <div className="mb-3 w-full flex flex-col gap-1">
        <label className="font-medium">Email Address</label>
        <Input
          type="email"
          placeholder="name@example.com"
          value={email || ""}
          className="border-0 bg-stone-100"
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="mb-3 w-full flex flex-col gap-1">
        <label className="font-medium">Password</label>
        <Input
          type="password"
          placeholder="Password"
          value={password || ""}
          className="border-0 bg-stone-100"
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <Button
        type="submit"
        disabled={loading || !email || !password}
        className={cn("rounded-xl w-full", loading && "loading")}
      >
        Login
      </Button>
    </form>
  );
};

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session && session.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
