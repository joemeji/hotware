import { authHeaders, baseUrl } from '@/utils/api.config';

const SendApprovalEmail = (_po_id: any, link:any, token: any) => {
    const SendEmail = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/purchases/${link}/${_po_id}`, {
          headers: authHeaders(token),
        });
        const result = await res.json();

        if (result.success) {
          console.log("Email was successfully sent.");
        } else {
          console.log("Error encountered while sending the email.");
        }
      } catch (err) {
        console.error("Error sending email:", err);
      }
    };
    
    SendEmail();
};

export default SendApprovalEmail;