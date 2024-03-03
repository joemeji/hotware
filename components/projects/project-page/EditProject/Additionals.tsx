import { Textarea } from "@/components/ui/textarea";

type Additional = {
  project_additional_notes?: any;
  errors?: any;
};

const Additional = ({ project_additional_notes, errors }: Additional) => {
  return (
    <div className="bg-background p-6 rounded-app shadow-sm w-1/2">
      <div className="flex flex-col">
        <p className="font-medium text-base">Additionals</p>
        <p className="">Additional details</p>

        <div className="mt-4">
          <Textarea
            placeholder="Additional Notes"
            className="border-0 bg-stone-100"
            {...project_additional_notes}
            error={errors && errors.project_additional_notes ? true : false}
          />
        </div>
      </div>
    </div>
  );
};

export default Additional;
