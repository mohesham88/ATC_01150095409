import { transporter } from ".";

interface mailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

export const resetPasswordEmailTemplate = (userMail: string, url: string) => {
  const emailBody = `<h1>Reset Password Request</h1>
  <p>Click the link below to reset your password:</p>
  <a href="${url}">Reset Password</a>
  <p>This link will expire in 1 hour</p>
  `;
  let mailOptions: mailOptions = {
    from: transporter.options.from as string,
    to: userMail,
    subject: "Password Reset Request",
    html: emailBody,
  };
  return mailOptions;
};
