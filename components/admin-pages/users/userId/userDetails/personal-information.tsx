import { memo, useState } from "react";

function PersonalInformation({ id, user }: any) {

  return (
    <div className="bg-white mt-3 flex">
      <div className="w-1/2 flex flex-col gap-5 rounded-xl shadow-md p-3 mr-2">
        <table cellPadding={5}>
          <tbody>
            <tr className="shadow-sm">
              <td className="mr-3 text-stone-400 font-small">FIRST NAME</td>
              <td className="font-small">{user.user_firstname}</td>
              <td className="mr-3 text-stone-400 font-small">MIDDLE NAME</td>
              <td className="font-small">{user.user_middlename}</td>
            </tr>
            <tr className="shadow-sm">
              <td className="mr-3 text-stone-400 font-small">LAST NAME</td>
              <td className="font-small">{user.user_lastname}</td>
              <td className="mr-3 text-stone-400 font-small">GENDER</td>
              <td className="font-small">{user.user_gender}</td>
            </tr>
            <tr className="shadow-sm">
              <td className="mr-3 text-stone-400 font-small">BIRTHDATE</td>
              <td className="font-small">{user.user_birthdate}</td>
              <td className="mr-3 text-stone-400 font-small">BIRTHPLACE</td>
              <td className="font-small">{user.user_birthplace}</td>
            </tr>
            <tr className="shadow-sm">
              <td className="mr-3 text-stone-400 font-small">RELIGION</td>
              <td className="font-small">{user.user_religion}</td>
              <td className="mr-3 text-stone-400 font-small">NATIONALITY</td>
              <td className="font-small">{user.user_nationality}</td>
            </tr>
            <tr className="shadow-sm">
              <td className="mr-3 text-stone-400 font-small">BLOOD TYPE</td>
              <td className="font-small">{user.user_blood_type}</td>
              <td className="mr-3 text-stone-400 font-small">ZIP CODE</td>
              <td className="font-small">{user.user_zip_code}</td>
            </tr>
            <tr className="shadow-sm">
              <td className="mr-3 text-stone-400 font-small">CURRENT ADDRESS</td>
              <td className="font-small" colSpan={3}>{user.user_current_address}</td>
            </tr>
            <tr className="shadow-sm">
              <td className="mr-3 text-stone-400 font-small">PERMANENT ADDRESS</td>
              <td className="font-small" colSpan={3}>{user.user_permanent_address}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="w-1/2 flex flex-col gap-5 rounded-xl shadow-md p-3 mr-2">
        <table cellPadding={5}>
          <tbody>
            <tr className="shadow-sm">
              <td className="mr-3 text-stone-400 font-small">COMPANY</td>
              <td className="font-small" colSpan={3}>{user.company_name}</td>
            </tr>
            <tr className="shadow-sm">
              <td className="mr-3 text-stone-400 font-small">JOB TITLE</td>
              <td className="font-small" colSpan={3}>{user.user_job_title}</td>
            </tr>
            <tr className="shadow-sm">
              <td className="mr-3 text-stone-400 font-small">EMPLOYED TYPE</td>
              <td className="font-small">{user.user_employed_type}</td>
              <td className="mr-3 text-stone-400 font-small">FUNCTION</td>
              <td className="font-small">{user.user_function}</td>
            </tr>
            <tr className="shadow-sm">
              <td className="mr-3 text-stone-400 font-small">EMAIL ADDRESS</td>
              <td className="font-small">{user.user_email_address}</td>
              <td className="mr-3 text-stone-400 font-small">CONTACT NUMBER</td>
              <td className="font-small">{user.user_contact_number}</td>
            </tr>
            <tr className="shadow-sm">
              <td className="mr-3 text-stone-400 font-small">DATE OF ENTRY</td>
              <td className="font-small">{user.user_start_date}</td>
              <td className="mr-3 text-stone-400 font-small">SSS NUMBER</td>
              <td className="font-small">{user.user_sss_number}</td>
            </tr>
            <tr className="shadow-sm">
              <td className="mr-3 text-stone-400 font-small">SHIRT SIZE</td>
              <td className="font-small">{user.user_shirt_size}</td>
              <td className="mr-3 text-stone-400 font-small">JACKET SIZE</td>
              <td className="font-small">{user.user_jacket_size}</td>
            </tr>
            <tr className="shadow-sm">
              <td className="mr-3 text-stone-400 font-small">TROUSER SIZE</td>
              <td className="font-small">{user.user_trouser_size}</td>
              <td className="mr-3 text-stone-400 font-small">SHOE SIZE</td>
              <td className="font-small">{user.user_shoe_size}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}


export default memo(PersonalInformation);