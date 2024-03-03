import { Separator } from "@/components/ui/separator";
import { ProjectDetailsContext } from "@/pages/projects/[project_id]";
import { useContext } from "react";

const Overview = ({ headerSize }: { headerSize?: any }) => {
  const project = useContext(ProjectDetailsContext);

  console.log(project);

  return (
    <>
      <div className="flex flex-col mt-2 bg-background rounded-xl shadow-sm p-3">
        <p className="text-lg font-medium">Overview</p>
        <Separator className="my-3" />
        <table>
          <tbody>
            <Row label="Project Name" content={project?.data?.project_name} />
            <Row
              label="Offer No."
              content={project?.data?.project_offer_number}
            />
            <Row
              label="Offer Date"
              content={project?.data?.project_offer_date}
            />
            <Row
              label="Purchase Order No."
              content={project?.data?.project_po_number}
            />
            <Row
              label="Purchase Order Date"
              content={project?.data?.project_po_date}
            />
            <Row
              label="Project Type"
              content={project?.data?.project_type_name}
            />
            <Row
              label="No. of Manpower"
              content={project?.data?.project_man_power}
            />
            <Row label="Industry" content={project?.data?.cms_industry_name} />
            <Row
              label="SharePoint Link"
              content={project?.data?.project_document_link}
            />
            <Row
              label="Additional Notes"
              content={project?.data?.project_additional_notes}
            />
          </tbody>
        </table>
      </div>
    </>
  );
};

const Row = ({ label, content }: { label?: any; content?: any }) => (
  <tr className="group">
    <td className="w-[200px] opacity-70 border-b py-3 group-last:border-0">
      {label}
    </td>
    <td className="border-b py-3 group-last:border-0 font-medium">{content}</td>
  </tr>
);

export default Overview;
