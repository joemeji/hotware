import { AccessTokenContext } from "@/context/access-token-context";
import { useContext } from "react";

export default function useAccessToken() {
  const accessToken = useContext(AccessTokenContext);

  return accessToken;
}
