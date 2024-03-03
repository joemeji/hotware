import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { memo, useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "@/components/ui/use-toast";
import { authHeaders, baseUrl } from "@/utils/api.config";
import { useSession } from "next-auth/react";
import { ProjectTechnicianSelect } from "../FormElements/ProjectTechnicianSelect";
import { ProjectRoleSelect } from "../FormElements/ProjectRoleSelect";
import { ProjectSecondRoleSelect } from "../FormElements/ProjectSecondRoleSelect";
import { Switch } from "@/components/ui/switch";
import { SkillSelect } from "../FormElements/SkillSelect";
import { TechnicianOverlap } from "./TechnicianOverlap";
import CompanySelect from "@/components/app/company-select";
import UserServiceSelect from "@/components/app/user-service-select";

const yupObject: any = {
  company_id: yup.number().required("This field is required."),
  user_service_id: yup.number(),
  user_skill_id: yup.number(),
  project_technician_id: yup.number().required("This field is required."),
  project_role_id: yup.number().required("This field is required."),
  project_second_role_id: yup.number().required("This field is required."),
};

function AddNewTechnician(props: AddNewTechnicianProps) {
  const { data: session }: any = useSession();
  let isAdded;
  const { open, onOpenChange, project, onSuccess } = props;
  const yupSchema = yup.object(yupObject);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [closeAfter, setCloseAfter] = useState(false);
  const [technicianOverlapAlert, setTechnicianOverlapAlert] = useState(false);
  const [addExistTechnician, setAddExistTechnician] = useState(false);
  const [projectOverlap, setProjectOverlap] = useState<any>([]);
  const [secondRole, setSecondRole] = useState<any>([]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    control,
    getValues,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  useEffect(() => {}, [addExistTechnician]);

  async function checkIfUserIsAddedOnProject(
    userID: any,
    e: any,
    shouldClose: any
  ) {
    e.preventDefault();
    const res = await fetch(
      `${baseUrl}/api/projects/${project._project_id}/technician/checkIfUserIsAddedOnProject/${userID}`,
      {
        method: "POST",
        headers: authHeaders(session.user.access_token),
      }
    );
    const json = await res.json();

    if (!json.success) {
      toast({
        title: json.message,
        variant: "destructive",
        duration: 4000,
      });
      setAddExistTechnician(false);
      return;
    }

    if (json.data.length > 0) {
      setTechnicianOverlapAlert(true);
      setProjectOverlap(json.data);
      if (addExistTechnician) {
        onSave(true, shouldClose);
      } else {
        onSave(true, shouldClose);
      }
    } else {
      setAddExistTechnician(true);
      onSave(true, shouldClose);
    }
  }

  async function onSave(toSave: any, shouldClose: any) {
    const payload = getValues();
    if (toSave) {
      payload.project_second_role_id = secondRole;
      const res = await fetch(
        `${baseUrl}/api/projects/${project._project_id}/technician/add`,
        {
          method: "POST",
          body: JSON.stringify(payload),
          headers: authHeaders(session.user.access_token),
        }
      );

      const json = await res.json();
      if (json && json.success) {
        toast({
          title: json.message,
          variant: "success",
          duration: 4000,
        });
        setTimeout(() => {
          onSuccess && onSuccess(true);
        }, 300);
      } else {
        toast({
          title: json.message,
          variant: "destructive",
          duration: 4000,
        });
      }
      if (shouldClose == true) {
        console.log({ shouldClose: shouldClose });
        onOpenChange && onOpenChange(shouldClose);
      }
    }
  }

  return (
    <>
      {technicianOverlapAlert && (
        <TechnicianOverlap
          open={technicianOverlapAlert}
          onOpenChange={(open: any) => setTechnicianOverlapAlert(open)}
          onSuccess={(evt: any) => {
            setAddExistTechnician(evt);
          }}
          projects={projectOverlap}
        />
      )}
      <Dialog
        open={open}
        onOpenChange={(open) => onOpenChange && onOpenChange(open)}
      >
        <DialogContent
          forceMount
          className="max-w-[550px] p-0 overflow-auto gap-0"
        >
          <DialogHeader className="py-2 px-3 flex justify-between flex-row items-center sticky top-0 bg-white z-10">
            <DialogTitle>Add Project Technician</DialogTitle>
            <DialogPrimitive.Close className="w-fit p-1.5 rounded-full bg-stone-100 hover:bg-stone-200">
              <X />
            </DialogPrimitive.Close>
          </DialogHeader>
          <div className="p-2">
            <div className="flex flex-col gap-2 py-1 rounded-app bg-white">
              <div className=" py-1 px-2"></div>
              <form action="" method="post">
                <div className="flex flex-col gap-3 px-2">
                  <div className="flex flex-col gap-3">
                    <label>Companies</label>
                    <Controller
                      name="company_id"
                      control={control}
                      render={({ field }) => (
                        <CompanySelect
                          onChangeValue={(value: any) => {
                            field.onChange(value);
                            setSelectedCompany(value);
                          }}
                          value={field.value}
                        />
                      )}
                    />
                  </div>
                  <div className="flex justify-end items-center space-x-2">
                    <Switch
                      id="show-filter"
                      onCheckedChange={(evt: any) => {
                        setShowFilters(evt);
                        if (!evt) {
                          setValue("user_service_id", 0);
                          setValue("user_skill_id", 0);
                          setSelectedService(null);
                          setSelectedSkill(null);
                        }
                      }}
                    />
                    <label htmlFor="show-filter">Show Filter</label>
                  </div>
                  {showFilters && (
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col gap-3">
                        <label>Services</label>
                        <Controller
                          name="user_service_id"
                          control={control}
                          render={({ field }) => (
                            <UserServiceSelect
                              onChangeValue={(value: any) => {
                                field.onChange(value);
                                setSelectedService(value);
                              }}
                              value={field.value}
                              project_id={project._project_id}
                            />
                          )}
                        />
                      </div>
                      <div className="flex flex-col gap-3">
                        <label>Skills</label>
                        <Controller
                          name="user_skill_id"
                          control={control}
                          render={({ field }) => (
                            <SkillSelect
                              onChangeValue={(value: any) => {
                                field.onChange(value);
                                setSelectedCompany(getValues("company_id"));
                                setSelectedSkill(value);
                              }}
                              value={field.value}
                              project_id={project._project_id}
                              service={selectedService}
                            />
                          )}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col gap-3">
                    <label>Technicians</label>
                    <Controller
                      name="project_technician_id"
                      control={control}
                      render={({ field }) => (
                        <ProjectTechnicianSelect
                          onChangeValue={(value: any) => {
                            field.onChange(value);
                          }}
                          value={field.value}
                          company_id={selectedCompany}
                          project_id={project._project_id}
                          user_service_id={getValues("user_service_id")}
                          user_skill_id={selectedSkill}
                        />
                      )}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col gap-3">
                      <label>Role</label>
                      <Controller
                        name="project_role_id"
                        control={control}
                        render={({ field }) => (
                          <ProjectRoleSelect
                            onChangeValue={(value: any) => {
                              field.onChange(value);
                            }}
                            value={field.value}
                            project_id={project._project_id}
                          />
                        )}
                      />
                    </div>
                    <div className="flex flex-col gap-3">
                      <label>Second Role</label>
                      <ProjectSecondRoleSelect
                        onChangeValue={(value: any) => {
                          setSecondRole(value);
                        }}
                        value={secondRole}
                        project_id={project._project_id}
                      />
                    </div>
                  </div>
                  <div>
                    <Button
                      className="mt-2 w-full"
                      onClick={(e: any) => {
                        setCloseAfter(false);
                        checkIfUserIsAddedOnProject(
                          getValues("project_technician_id"),
                          e,
                          false
                        );
                      }}
                    >
                      ADD
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default memo(AddNewTechnician);

type AddNewTechnicianProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  project?: any;
  onSuccess?: (success: boolean) => void;
};
