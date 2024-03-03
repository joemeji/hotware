import { Input } from "@/components/ui/input";
import React from "react";

type ProjectDetails = {
  project_name?: any;
  project_offer_number?: any;
  project_offer_date?: any;
  project_po_number?: any;
  project_po_date?: any;
  renderProjectType?: React.ReactNode;
  renderRequirementLevel?: React.ReactNode;
  project_man_power?: any;
  project_origin_of_equipment?: any;
  project_factory_place?: any;
  document_link?: any;
  errors?: any;
};

const ProjectDetails = ({
  project_name,
  project_offer_number,
  project_offer_date,
  project_po_number,
  project_po_date,
  renderProjectType,
  renderRequirementLevel,
  project_man_power,
  project_origin_of_equipment,
  project_factory_place,
  document_link,
  errors,
}: ProjectDetails) => {
  return (
    <>
      <div className="bg-background p-6 rounded-app shadow-sm w-1/2">
        <div className="flex flex-col mb-4">
          <p className="font-medium text-base">Project Details</p>
          <p className="">Add project details</p>
        </div>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1">
            <label className="font-medium">Project Name</label>
            <Input
              className="bg-stone-100 border-0"
              placeholder="Enter Project Name"
              {...project_name}
              error={errors && errors.project_name ? true : false}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1 w-1/3">
              <label className="font-medium">Offer No.</label>
              <Input
                className="bg-stone-100 border-0"
                placeholder="Enter Offer No."
                {...project_offer_number}
                error={errors && errors.project_offer_number ? true : false}
              />
            </div>
            <div className="flex flex-col gap-1 w-1/3">
              <label className="font-medium">Offer Date</label>
              <Input
                className="bg-stone-100 border-0"
                type="date"
                {...project_offer_date}
                error={errors && errors.project_offer_date ? true : false}
              />
            </div>
            <div className="flex flex-col gap-1 w-1/3">
              <label className="font-medium">Purchase No.</label>
              <Input
                className="bg-stone-100 border-0"
                placeholder="Enter Purchase No."
                {...project_po_number}
                error={errors && errors.project_po_number ? true : false}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1 w-1/3">
              <label className="font-medium">Purchase Order Date</label>
              <Input
                className="bg-stone-100 border-0"
                type="date"
                {...project_po_date}
                error={errors && errors.project_po_date ? true : false}
              />
            </div>
            <div className="flex flex-col gap-1 w-1/3">
              <label className="font-medium">Project Type</label>
              {renderProjectType}
            </div>
            <div className="flex flex-col gap-1 w-1/3">
              <label className="font-medium">No. of Manpower</label>
              <Input
                type="number"
                className="bg-stone-100 border-0"
                placeholder="Enter No. of Manpower"
                {...project_man_power}
                error={errors && errors.project_man_power ? true : false}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1 w-1/2">
              <label className="font-medium">Origin of Equipment</label>
              <Input
                className="bg-stone-100 border-0"
                placeholder="Enter Origin of Equipment"
                {...project_origin_of_equipment}
                error={
                  errors && errors.project_origin_of_equipment ? true : false
                }
              />
            </div>
            <div className="flex flex-col gap-1 w-1/2">
              <label className="font-medium">Furnace / Unit No</label>
              <Input
                className="bg-stone-100 border-0"
                placeholder="Furnace / Unit No"
                {...project_factory_place}
                error={errors && errors.project_factory_place ? true : false}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">SharePoint Link</label>
            <Input
              className="bg-stone-100 border-0"
              placeholder="SharePoint Link"
              {...document_link}
              error={errors && errors.document_link ? true : false}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Requirement Level</label>
            {renderRequirementLevel}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectDetails;
