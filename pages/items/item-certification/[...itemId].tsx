import AdminLayout from "@/components/admin-layout";
import '@splidejs/react-splide/css/core';
import '@splidejs/react-splide/css';
import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { authHeaders, baseUrl } from "@/utils/api.config";
import Protocol from "@/components/items/item-certification/protocol";
import SelectForm from "@/components/items/item-certification/protocol/select-form";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useRouter } from "next/router";
import { Frown, Lightbulb } from "lucide-react";

export default function ItemCertification({ equipmentDetails, forms, access_token, userSelectedForm }: any) {
  const [selectedForm, setSelectedForm] = useState<any>(null);
  const router = useRouter();
  const [promptHasForm, setPrompHasForm] = useState(false);

  const onClickForm = (form: any) => {
    setSelectedForm(form);
    if (Number(form.has_form_created) === 1) {
      setPrompHasForm(true);
    }
  };

  const onClickContinue = () => {
    if (selectedForm) {
      router.query.show_protocol = '1';
      router.query.form = selectedForm.form_id;
    }
    setPrompHasForm(false);
    router.push(router);
  };

  return (
    <AdminLayout>

      {router.query.show_protocol && router.query.form ? (
        <Protocol 
          equipmentDetails={equipmentDetails} 
          forms={forms}
          access_token={access_token}
          userSelectedForm={userSelectedForm}
        />
      ) : (
        <>
          <SelectForm 
            equipmentDetails={equipmentDetails} 
            forms={forms} 
            onClickForm={onClickForm}
            userSelectedForm={userSelectedForm}
          />
          <AlertDialog open={selectedForm && Number(selectedForm.has_form_created) === 0}>
            <AlertDialogContent className="border-0">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-3 border-b pb-3">
                  <span className="p-1 bg-orange-100 rounded-full">
                    <Frown />
                  </span>
                  <span>No Form Found</span>
                </AlertDialogTitle>
                <AlertDialogDescription className="text-lg">
                  As of now, no form has been generated for the {selectedForm && selectedForm.form_description}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedForm(null)} 
                  className="bg-stone-800 text-white hover:bg-stone-700 hover:text-white"
                >
                  Close
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={promptHasForm}>
            <AlertDialogContent className="border-0">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-3 border-b pb-3">
                  <span className="p-1 bg-orange-100 rounded-full">
                    <Lightbulb />
                  </span>
                  <span>Reminder</span>
                </AlertDialogTitle>
                <AlertDialogDescription className="text-lg">
                  Kindly take some time to review the procedural instructions outlining the functionality of the item protocol. Your cooperation is greatly appreciated. Thank you 😉.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setPrompHasForm(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction onClick={onClickContinue}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </>
      )}
    </AdminLayout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const itemId: any = context.query.itemId;
  const session = await getServerSession( context.req, context.res, authOptions );
  let token  = null;
  let equipmentDetails = null;
  let forms = null;
  let userSelectedForm = null;

  if (session && session.user) {
    token = session.user.access_token;
  } else {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false,
      },
    }
  }

  const id = itemId[0];

  if (itemId[1] && itemId[1] === 'sn') {
    const res = await fetch(baseUrl + '/api/items/serial_number/' + id, {
      headers: { ...authHeaders(token) }
    });
    const json = await res.json();
    if (json) equipmentDetails = json;
  }

  if (itemId[1] && itemId[1] === 'equipment') {
    const res = await fetch(baseUrl + `/api/items/${id}/equipment`, {
      headers: { ...authHeaders(token) }
    });
    const json = await res.json();
    if (json) equipmentDetails = json;
  }

  if (!equipmentDetails) {
    return {
      redirect: {
        destination: '/items',
        permanent: false,
      },
    }
  }

  const formRes = await fetch(baseUrl + `/api/forms/all`, {
    headers: { ...authHeaders(token) }
  }); 
  forms = await formRes.json();

  if (id && itemId[1]) {
    const payload: any = {
      item_type: itemId[1],
      form_id: context.query.form,
      item_ref_id: id,
    };
    const queryString = new URLSearchParams(payload).toString();
    const res = await fetch(baseUrl + "/api/forms/user_selected_form?" + queryString, {
      headers: { ...authHeaders(token) }
    });
    userSelectedForm = await res.json();
  }

  return {
    props: {
      equipmentDetails: equipmentDetails,
      forms: forms,
      access_token: token,
      userSelectedForm,
    }
  }
}
