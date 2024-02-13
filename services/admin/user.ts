import { baseUrl } from "@/utils/api.config";

type Options = {
  headers: any;
};

export const getUserDetails = async (user_id: string, options: Options) => {
  try {
    const response = await fetch(
      `${baseUrl}/api/users/get_user_details/${user_id}`,
      {
        ...options,
      }
    );
    return await response.json();
  } catch (error) {
    return null;
  }
};
