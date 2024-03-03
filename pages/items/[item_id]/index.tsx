import { GetServerSidePropsContext } from "next";

export default function ItemId() {
  return <></>;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  return {
    redirect: {
      destination: "/items/" + context.params?.item_id + "/details",
      permanent: false,
    },
  };
}
