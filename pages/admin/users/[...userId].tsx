import AdminLayout from "@/components/admin-layout";
import ProfileInfo from "@/components/admin-pages/users/userId/profile-info";

export default function UserView() {
  return (
    <AdminLayout>
      <div className="p-[20px] w-full max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-3">
          <ProfileInfo />
          <div className="rounded-xl p-5 shadow-sm bg-white">
            <p className="text-lg font-medium">Work Schedule</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm bg-white">
            <p className="text-lg font-medium">Daily Rate</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm bg-white">
            <p className="text-lg font-medium">Personal Information</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm bg-white">
            <p className="text-lg font-medium">Emergency Contacts</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm bg-white">
            <p className="text-lg font-medium">Employment History</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm bg-white">
            <p className="text-lg font-medium">Skills</p>
          </div>
          <div className="rounded-xl p-5 shadow-sm bg-white">
            <p className="text-lg font-medium">Hobbies</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}