import nodemailer from 'nodemailer';

import config from '../config/index.js';
import { compileTemplate } from './templateCompiler.js';

const transporter = nodemailer.createTransport({
  host: config.brevo.host,
  port: config.brevo.port,
  secure: false,
  auth: {
    user: config.brevo.user,
    pass: config.brevo.pass,
  },
});

async function sendEmail({ to, subject, template, data }) {
  const html = compileTemplate(template, data);

  const mailOptions = {
    from: `"${config.brevo.fromName}" <${config.brevo.fromEmail}>`,
    to,
    subject,
    html,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent: ${info.messageId}`);
  return info;
}

export { sendEmail };
