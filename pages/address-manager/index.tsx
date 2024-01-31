  import AdminLayout from "@/components/admin-layout";
  import AddressManager from "@/components/address-manager";

  export default function Index() {
    return (
      <AdminLayout>
        <div className="pt-[20px] px-[20px] pb-[20px] w-full max-w-[1600px] mx-auto flex gap-3">
          <AddressManager />
        </div>
      </AdminLayout>
    );
  }