
import { memo } from "react";

function EmergencyContact({ id, user }: any) {
  console.log({ user: user })
  return (
    <div className="bg-white mt-3 flex">
      <div className="w-full flex flex-col gap-5 rounded-xl shadow-md p-3 mr-2">
        <table cellPadding={5}>
          <thead>
            <tr>
              <th>FIRST NAME</th>
              <th>LAST NAME</th>
              <th>TELEPHONE NO.</th>
              <th>MOBILE NO.</th>
              <th>RELATIONSHIP</th>
            </tr>
          </thead>
          <tbody>
            {user.emergency_contacts.map((contact: any, index: number) => (
              <tr className="shadow-sm" key={index}>
                <td className="font-small text-center">{contact.uec_firstname}</td>
                <td className="font-small text-center">{contact.uec_lastname}</td>
                <td className="font-small text-center">{contact.uec_telephone_number}</td>
                <td className="font-small text-center">{contact.uec_mobile_number}</td>
                <td className="font-small text-center">{contact.uec_relationship}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default memo(EmergencyContact);