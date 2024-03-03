import { authHeaders, baseUrl } from '@/utils/api.config';

const SendTaskEmail = (trigger: any, token: any) => {
    const SendEmail = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/projects/sendmail/${trigger}`, {
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

export default SendTaskEmail;