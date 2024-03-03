import { useSession } from "next-auth/react";

export function useModuleAccess() {
  const { data: session, status } = useSession();
  const user: any = session?.user;

  console.log(status);

  if (status === "authenticated" && user?.module_access) {
    return user.module_access;
  }

  return null;
}
