import AdminLayout from "@/components/admin-layout";
// import ProfileInfo from "@/components/admin-pages/users/userId/profile-info";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";
import { getServerSession } from "next-auth";
import { getUserDetails } from "@/services/admin/user";
import { authHeaders } from "@/utils/api.config";
import dynamic from "next/dynamic";

const EmergencyContact = dynamic(() => import('@/components/admin-pages/users/userId/userDetails/emergency-contact'));
const PersonalInformation = dynamic(() => import('@/components/admin-pages/users/userId/userDetails/personal-information'));
const WorkSchedule = dynamic(() => import('@/components/admin-pages/users/userId/userDetails/work-schedule'));
const ProfileInfo = dynamic(() => import('@/components/admin-pages/users/userId/userDetails/profile-info'));
const UserSkills = dynamic(() => import('@/components/admin-pages/users/userId/userDetails/skills'));
const UserHobbies = dynamic(() => import('@/components/admin-pages/users/userId/userDetails/hobbies'));

export default function UserView({ user_id, user }: any) {
  return (
    <AdminLayout>
      <div className="p-[20px] w-full max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-3">
          <ProfileInfo user={user} />
          <div className="rounded-xl p-5 shadow-sm bg-white">
            <p className="text-lg font-medium">Personal Information</p>
            <PersonalInformation id={user_id} user={user} />
          </div>
          <div className="rounded-xl p-5 shadow-sm bg-white">
            <p className="text-lg font-medium">Emergency Contacts</p>
            <EmergencyContact id={user_id} user={user} />
          </div>
          <div className="rounded-xl p-5 shadow-sm bg-white">
            <p className="text-lg font-medium">Skills</p>
            <UserSkills id={user_id} user={user} />
          </div>
          <div className="rounded-xl p-5 shadow-sm bg-white">
            <p className="text-lg font-medium">Hobbies</p>
            <UserHobbies id={user_id} user={user} />
          </div>
          <div className="rounded-xl p-5 shadow-sm bg-white">
            <p className="text-lg font-medium">Work Schedule</p>
            <WorkSchedule id={user_id} user={user} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session?.user?.access_token) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  if (!context?.params?.userId) {
    return {
      redirect: {
        destination: '/admin/users/index',
        permanent: false,
      },
    }
  }

  const user = await getUserDetails(context.params.userId as string, {
    headers: authHeaders(session.user.access_token)
  });

  if (!user) {
    return {
      redirect: {
        destination: '/admin/users/index',
        permanent: false,
      },
    }
  }

  return {
    props: {
      user_id: context.params.userId,
      user
    },
  }
}