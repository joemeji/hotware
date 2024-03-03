import AdminLayout from "@/components/admin-layout";
import LoadingListPreview from "@/components/LoadingList/LoadingPreview";
import { AccessTokenContext } from "@/context/access-token-context";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { fetcher } from "@/utils/api.config";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { memo } from "react";
import useSWR from "swr";
import { LoadingListDetailsContext } from "..";

const Preview = ({ access_token }: any) => {
  const router = useRouter();
  const { data, isLoading, error } = useSWR(
    `/api/loading-list/${router.query.loading_id}/details`,
    fetcher
  );

  return (
    <AccessTokenContext.Provider value={access_token}>
      <LoadingListDetailsContext.Provider value={data}>
        <LoadingListPreview />
      </LoadingListDetailsContext.Provider>
    </AccessTokenContext.Provider>
  );
};

export default memo(Preview);

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  let user = session ? session.user : null;

  const access_token = user ? user.access_token : null;

  return {
    props: {
      access_token,
    },
  };
}
