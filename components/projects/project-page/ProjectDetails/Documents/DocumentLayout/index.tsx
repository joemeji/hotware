import AdminLayout from "@/components/admin-layout";
import Layout from "../../Layout";
import Tab from "./Tab";

const DocumentLayout = ({
  render,
}: {
  render?: (headerSize?: any) => React.ReactNode;
}) => {
  return (
    <AdminLayout>
      <Layout
        render={(headerSize) => (
          <div className="flex gap-3 mt-5">
            <div className="w-[250px]">
              <Tab />
            </div>
            <div className="w-[calc(100%-250px)]">
              {render && render(headerSize)}
            </div>
          </div>
        )}
      />
    </AdminLayout>
  );
};

export default DocumentLayout;
