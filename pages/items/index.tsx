"use client";

import AdminLayout from "@/components/admin-layout";
import type { GetServerSidePropsContext } from "next";
import { baseUrl } from "@/utils/api.config";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import React, { createContext } from "react";
import Category from "@/components/items/Category";
import ItemsData from "@/components/items/ItemsData";
import { AccessTokenContext } from "@/context/access-token-context";

export const MainCategoryContext = createContext<{
  main_categories: any;
  categories: any;
}>({ main_categories: null, categories: null });

export default function Items({
  main_categories,
  categories,
  access_token,
}: any) {
  return (
    <AdminLayout>
      <AccessTokenContext.Provider value={access_token}>
        <div className="pt-[20px] px-[20px] w-full max-w-[1600px] mx-auto flex gap-3">
          <MainCategoryContext.Provider value={{ main_categories, categories }}>
            <ItemsData />
            <Category />
          </MainCategoryContext.Provider>
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

  const headers = { Authorization: "Bearer " + token };

  let res = await fetch(baseUrl + "/api/main_categories", { headers });
  // let main_categories = await res.json();

  res = await fetch(baseUrl + "/api/categories/all", { headers });
  let main_categories = await res.json();

  let allCategories: any[] = [];

  if (Array.isArray(main_categories)) {
    main_categories.forEach((item: any) => {
      if (Array.isArray(item.categories)) {
        item.categories.forEach((item: any) => {
          allCategories.push({
            ...item,
          });
        });
      }
    });
  }

  return {
    props: {
      main_categories,
      categories: allCategories,
      access_token: token,
    },
  };
}
