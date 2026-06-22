import emailjs from '@emailjs/browser';

// Email configuration types
interface EmailConfig {
  publicKey: string;
  serviceId: string;
  templateId: string;
}

// Configuration for different email accounts
const EMAIL_CONFIGS = {
  account1: {
    publicKey: "59eACLJDloIEotBQn", //leo
    serviceId: 'service_8m223te',
    templateId: 'template_ikvdtih',
  },
  account2: {
    publicKey: "RFNcndFJHHV3_JFeb", //maria
    serviceId: 'service_tz1hmm1', 
    templateId: 'template_l306mu3', 
  }
} as const;

type EmailAccount = keyof typeof EMAIL_CONFIGS;

/**
 * Sends an email using the EmailJS service with specified account configuration.
 * @param account - Which email account to use ('account1' or 'account2')
 * @param templateParams - Template parameters for the email
 */
export const sendEmail = async (
  account: EmailAccount,
  templateParams: Record<string, string | number>
) => {
  const config = EMAIL_CONFIGS[account];

  // try {
  //   // Initialize with the specific account's public key
  //   emailjs.init(config.publicKey);

  //   const response = await emailjs.send(
  //     config.serviceId,
  //     config.templateId,
  //     templateParams
  //   );
  //   console.log("✅ Email sent successfully!", response.status, response.text);
  //   return true;
  // } catch (error) {
  //   console.error("❌ Failed to send email:", error);
  //   return false;
  // }
};
