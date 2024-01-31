'use client';

import AdminLayout from "@/components/admin-layout";
import type { GetServerSidePropsContext } from 'next';
import { baseUrl } from "@/utils/api.config";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";
import React from "react";
import Category from "@/components/items/Category";
import ItemsData from "@/components/items/ItemsData";


export default function Items({ main_categories, categories, access_token }: any) {
  return (
    <AdminLayout>
      <div className="pt-[20px] px-[20px] w-full max-w-[1600px] mx-auto flex gap-3">
        <ItemsData 
          access_token={access_token} 
          categories={categories}
        />
        <Category 
          main_categories={main_categories} 
          categories={categories} 
        />
      </div>
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

  const headers = { Authorization: 'Bearer ' + token };

  let res = await fetch(baseUrl + '/api/main_categories', { headers });
  // let main_categories = await res.json();

  res = await fetch(baseUrl + '/api/categories/all', { headers });
  let main_categories = await res.json();

  let allCategories: any[] = [];

  if (main_categories && Array.isArray(main_categories)) {
    main_categories.forEach((item: any) => {
      if (item.categories && Array.isArray(item.categories)) {
        item.categories.forEach((item: any) => {
          allCategories.push({
            ...item
          })
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
  }
}