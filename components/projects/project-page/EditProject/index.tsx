import ProjectTypeSelect from "@/components/app/project-type-select";
import CmsSelect from "@/components/app/cms-select";
import CmsAddressSelect from "@/components/projects/shipping-list/EditShippingDetails/CmsAddressSelect";
import CmsEmployeeSelect from "@/components/app/cms-employee-select";
import { Button } from "@/components/ui/button";
import ProjectDetails from "./ProjectDetails";
import ScopeOfWork from "./ScopeOfWork";
import Additional from "./Additionals";
import ClientDetails from "./ClientDetails";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import yupSchema from "./yupSchema";
import RequirementLevelSelect from "@/components/app/requirement-level-select";
import { createContext, useContext, useEffect, useState } from "react";
import NewContactPersonModal from "@/components/address-manager/details/ContactPersonTab/modals/NewContactPersonModal";
import MoreOption from "@/components/MoreOption";
import { ItemMenu } from "@/components/items";
import _ from "lodash";
import { authHeaders, baseUrl, fetchApi } from "@/utils/api.config";
import { cn } from "@/lib/utils";
import { toast } from "@/components/ui/use-toast";
import { useRouter as useNavRouter } from "next/navigation";
import { CmsDetailsContext } from "@/pages/address-manager/[cms_id]";
import { AccessTokenContext } from "@/context/access-token-context";
import useSWR from "swr";
import { useRouter } from "next/router";
import SendTaskEmail from "../../send-email/SendTaskEmail";

export const AliasesContext = createContext(null);

const EditProjectPage = () => {
  const [aliases, setAliases] = useState<any>([]);
  const [cms_id1, set_cms_id1] = useState(null);
  const [cms_id2, set_cms_id2] = useState(null);
  const [employee_id1, set_employee_id1] = useState(null);
  const [employee_id2, set_employee_id2] = useState(null);
  const [cms1, set_cms1] = useState<any>(null);
  const [cms2, set_cms2] = useState<any>(null);
  const [selectedCms, setSelectedCms] = useState<any>(null);
  const [openNewContact, setOpenNewContact] = useState(false);
  const [scopes, setScopes] = useState<any>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const navRouter = useNavRouter();
  const access_token = useContext(AccessTokenContext);
  const router = useRouter();

  const payload: any = {};
  const queryString = new URLSearchParams(payload).toString();
  const { data, isLoading } = useSWR(
    [`/api/projects/${router.query.project_id}?${queryString}`, access_token],
    fetchApi
  );

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    resolver: yupResolver(yupSchema),
  });

  const onAddAlias = (employeeId: any, aliasName?: any) => {
    const _aliases = [...aliases];
    const aliasIndex = _aliases.findIndex(
      (item: any) => item.id === employeeId
    );
    if (aliasIndex !== -1) {
      _aliases[aliasIndex].alias = aliasName;
      setAliases(_aliases);
    }
  };

  const onSubmit = async (data: any) => {
    const payload = { ...data };
    setLoadingSubmit(true);

    try {
      let requirementsLevel = getValues("requirementsLevel");

      if (Array.isArray(requirementsLevel) && requirementsLevel.length > 0) {
        requirementsLevel = _.union([...requirementsLevel]);
        requirementsLevel = requirementsLevel.map((id: any) => {
          return {
            document_level_id: id,
            alias: "",
          };
        });
        payload["requirementsLevel"] = JSON.stringify(requirementsLevel);
      }

      if (Array.isArray(scopes) && scopes.length > 0) {
        payload["scopes"] = JSON.stringify(scopes);
      }

      if (Array.isArray(aliases) && aliases.length > 0) {
        const _aliases = [...aliases].map((item: any) => {
          delete item.cms_id;
          return item;
        });
        payload["contacts"] = JSON.stringify(_aliases);
      }

      const formData = new FormData();

      for (let [key, value] of Object.entries(payload)) {
        formData.append(key, value as string);
      }

      const res = await fetch(
        `${baseUrl}/api/projects/${router.query.project_id}/update`,
        {
          method: "POST",
          body: formData,
          headers: authHeaders(access_token, true),
        }
      );

      const json = await res.json();

      if (json.success) {
        toast({
          title: "New project added successfully.",
          variant: "success",
          duration: 2000,
        });

        setTimeout(() => {
          setLoadingSubmit(false);
          navRouter.push("/projects/" + json._project_id);

          // send task emails
          SendTaskEmail("UPDATE_PROJECT", access_token);
        }, 300);
      }
    } catch (err) {
    } finally {
      setLoadingSubmit(false);
    }
  };

  const onChangeContactPerson = (employee: any) => {
    const _aliases: any = [...aliases];
    const alias = _aliases.find(
      (item: any) => item.id === employee.cms_employee_id
    );

    if (!alias) {
      _aliases.push({
        id: employee.cms_employee_id,
        name: `${employee.cms_employee_firstname} ${employee.cms_employee_lastname}`,
        alias: null,
        cms_id: employee.cms_id,
      });
    } else {
      const aliasIndex = _aliases.findIndex(
        (item: any) => item.id === alias.id
      );

      _aliases[aliasIndex].id = employee.cms_employee_id;
      _aliases[
        aliasIndex
      ].name = `${employee.cms_employee_firstname} ${employee.cms_employee_lastname}`;
      _aliases[aliasIndex].cms_id = employee.cms_id;
      // _aliases[aliasIndex].alias = null;
    }

    setAliases(_aliases);
  };

  const onCms1Change = (value: any) => {
    // set_cms_id1(value);
    setValue("cms_address_id1", "");
    setValue("cms_employee_id1", "");
    // set_employee_id1(null);
    resetContactAliases(value);
  };

  const onCms2Change = (value: any) => {
    // set_cms_id2(value);
    setValue("cms_address_id2", "");
    setValue("cms_employee_id2", "");
    // set_employee_id2(null);
    resetContactAliases(value);
  };

  const resetContactAliases = (cms_id: any) => {
    let _aliases = [...aliases];
    const cms_id1 = getValues("cms_id1");
    const cms_id2 = getValues("cms_id2");

    if (cms_id !== cms_id1) {
      _aliases = _aliases.filter((item: any) => item.cms_id === cms_id1);
    }

    if (cms_id !== cms_id2) {
      _aliases = _aliases.filter((item: any) => item.cms_id === cms_id2);
    }

    setAliases(_aliases);
  };

  const onAddNewContact = (type: any) => {
    let cms: any;

    if (type === "client") cms = cms1;
    if (type === "delivery") cms = cms2;

    setSelectedCms(cms);
    setOpenNewContact(true);
  };

  const onRemoveAlias = (index: any) => {
    const _aliases = [...aliases];

    if (_aliases[index]) {
      _aliases[index].alias = null;
      _aliases[index].removed = true;
    }

    setAliases(_aliases);
  };

  useEffect(() => {
    if (Array.isArray(data?.contacts)) {
      const _contacts: any = [];

      data.contacts.forEach((co: any) => {
        _contacts.push({
          id: co.cms_employee_id,
          name: `${co.cms_employee_firstname} ${co.cms_employee_lastname}`,
          alias: co.pcc_alias,
          cms_id: co.cms_id,
          pcc_id: co.pcc_id,
        });
      });

      set_cms_id1(data.cms_id);
      set_cms_id2(data.cms_delivery_id);

      setAliases(_contacts);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      setValue("project_name", data.project_name);
      setValue("project_offer_number", data.project_offer_number);
      setValue("project_offer_date", data.project_offer_date);
      setValue("project_po_number", data.project_po_number);
      setValue("project_po_date", data.project_po_date);
      setValue("project_man_power", data.project_man_power);
      setValue("project_origin_of_equipment", data.project_origin_of_equipment);
      setValue("document_link", data.project_document_link);
      setValue(
        "project_travelling_back_date",
        data.project_travelling_back_date
      );
      setValue(
        "project_travelling_back_days",
        data.project_travelling_back_days
      );

      setValue("cms_id1", data.cms_id);
      setValue("cms_id2", data.cms_delivery_id);
      setValue("cms_address_id1", data.cms_address_id);
      setValue("cms_address_id2", data.cms_site_address_id);
      setValue("project_type_id", data.project_type_id);
      setValue("project_additional_notes", data.project_additional_notes);
      setValue("project_factory_place", data.project_factory_place);

      setValue("project_travelling_days", data.project_travelling_days);
      setValue("project_travelling_date", data.project_travelling_date);
      setValue("project_installation_days", data.project_installation_days);
      setValue("project_installation_date", data.project_installation_date);
      setValue("project_dismantling_days", data.project_dismantling_days);
      setValue("project_dismantling_date", data.project_dismantling_date);
      setValue(
        "project_travelling_back_days",
        data.project_travelling_back_days
      );
      setValue(
        "project_travelling_back_date",
        data.project_travelling_back_date
      );
      setValue("project_working_days", data.project_working_days);
      setValue("project_start_date", data.project_start_date);
      setValue("project_end_date", data.project_end_date);

      set_cms_id1(data.cms_id);
      set_cms_id2(data.cms_delivery_id);

      if (Array.isArray(data.requirement_levels)) {
        setValue(
          "requirementsLevel",
          data.requirement_levels.map((item: any) => item.document_level_id)
        );
      }
    }
  }, [data, setValue]);

  return (
    <>
      <CmsDetailsContext.Provider value={selectedCms}>
        <NewContactPersonModal
          open={openNewContact}
          onOpenChange={(open: any) => setOpenNewContact(open)}
        />
      </CmsDetailsContext.Provider>
      <form
        className="pt-[20px] px-[20px] pb-[20px] w-full max-w-[1600px] mx-auto flex flex-wrap gap-3"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="flex justify-between bg-background p-3 rounded-app items-center shadow-sm w-full">
          <h1 className="text-lg font-medium">Edit Project</h1>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="secondary"
              disabled={loadingSubmit}
              onClick={() => {
                navRouter.back();
              }}
            >
              Back
            </Button>
            <Button
              type="submit"
              className={cn(loadingSubmit && "loading")}
              disabled={loadingSubmit || isLoading}
            >
              Update
            </Button>
          </div>
        </div>
        <div className="flex gap-4 w-full">
          <ProjectDetails
            renderProjectType={
              <Controller
                name="project_type_id"
                control={control}
                render={({ field }) => (
                  <ProjectTypeSelect
                    value={field.value}
                    onChangeValue={(value) => field.onChange(value)}
                  />
                )}
              />
            }
            renderRequirementLevel={
              <Controller
                name="requirementsLevel"
                control={control}
                render={({ field }) => (
                  <RequirementLevelSelect
                    multiple={true}
                    onChangeValue={(value: any) => {
                      field.onChange(value);
                    }}
                    value={field.value}
                  />
                )}
              />
            }
            project_name={register("project_name")}
            project_offer_number={register("project_offer_number")}
            project_offer_date={register("project_offer_date")}
            project_po_number={register("project_po_number")}
            project_po_date={register("project_po_date")}
            project_man_power={register("project_man_power")}
            project_origin_of_equipment={register(
              "project_origin_of_equipment"
            )}
            errors={errors}
            project_factory_place={register("project_factory_place")}
            document_link={register("document_link")}
          />

          <AliasesContext.Provider value={aliases}>
            <ClientDetails
              onRemoveAlias={onRemoveAlias}
              renderAddContactButton={(type) => (
                <MoreOption>
                  <ItemMenu
                    className="font-medium type"
                    onClick={() => onAddNewContact(type)}
                  >
                    New Contact
                  </ItemMenu>
                </MoreOption>
              )}
              renderInvoiceCompany={
                <>
                  {cms_id1}asas
                  <Controller
                    name="cms_id1"
                    control={control}
                    render={({ field }) => (
                      <CmsSelect
                        placeholder="Company"
                        onChangeValue={(value) => {
                          field.onChange(value);
                          onCms1Change(value);
                        }}
                        defaultValue={cms_id1}
                        value={field.value}
                        onSelectedItem={(cms) => set_cms1(cms)}
                      />
                    )}
                  />
                </>
              }
              renderInvoiceLocation={
                <Controller
                  name="cms_address_id1"
                  control={control}
                  render={({ field }) => (
                    <CmsAddressSelect
                      placeholder="Location"
                      onChangeValue={(value) => field.onChange(value)}
                      value={field.value}
                      cms_id={cms_id1}
                    />
                  )}
                />
              }
              showAddAliasDelivery={employee_id2}
              showAddAliasClient={employee_id1}
              renderInvoiceContactPerson={
                <Controller
                  name="cms_employee_id1"
                  control={control}
                  render={({ field }) => (
                    <CmsEmployeeSelect
                      placeholder="Contact Person"
                      onChangeValue={(value) => {
                        field.onChange(value);
                        set_employee_id1(value);
                      }}
                      value={field.value}
                      cms_id={cms_id1}
                      onChange={onChangeContactPerson}
                    />
                  )}
                />
              }
              renderDeliverCompany={
                <Controller
                  name="cms_id2"
                  control={control}
                  render={({ field }) => (
                    <CmsSelect
                      placeholder="Company"
                      onChangeValue={(value) => {
                        field.onChange(value);
                        onCms2Change(value);
                      }}
                      value={field.value}
                      onSelectedItem={(cms) => set_cms2(cms)}
                      defaultValue={cms_id2}
                    />
                  )}
                />
              }
              renderDeliverLocation={
                <Controller
                  name="cms_address_id2"
                  control={control}
                  render={({ field }) => (
                    <CmsAddressSelect
                      placeholder="Location"
                      onChangeValue={(value) => field.onChange(value)}
                      value={field.value}
                      cms_id={cms_id2}
                    />
                  )}
                />
              }
              renderDeliverContactPerson={
                <Controller
                  name="cms_employee_id2"
                  control={control}
                  render={({ field }) => (
                    <CmsEmployeeSelect
                      placeholder="Contact Person"
                      onChangeValue={(value) => {
                        field.onChange(value);
                        set_employee_id2(value);
                      }}
                      value={field.value}
                      cms_id={cms_id2}
                      onChange={onChangeContactPerson}
                    />
                  )}
                />
              }
              onAddAlias={onAddAlias}
            />
          </AliasesContext.Provider>
        </div>
        <div className="flex gap-4 w-full">
          <ScopeOfWork
            project_travelling_date={register("project_travelling_date")}
            project_travelling_days={register("project_travelling_days")}
            project_installation_date={register("project_installation_date")}
            project_installation_days={register("project_installation_days")}
            project_working_days={register("project_working_days")}
            project_start_date={register("project_start_date")}
            project_end_date={register("project_end_date")}
            project_dismantling_date={register("project_dismantling_date")}
            project_dismantling_days={register("project_dismantling_days")}
            project_travelling_back_date={register(
              "project_travelling_back_date"
            )}
            project_travelling_back_days={register(
              "project_travelling_back_days"
            )}
            errors={errors}
            onAddedScopes={(scopes) => setScopes(scopes)}
            setValue={setValue}
            data={data}
          />
          <Additional
            project_additional_notes={register("project_additional_notes")}
            errors={errors}
          />
        </div>
      </form>
    </>
  );
};

export default EditProjectPage;
