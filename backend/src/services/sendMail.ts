import nodemailer from "nodemailer";
import { getAlertEmails } from "./settings.js";
import { configDotenv } from "dotenv";
configDotenv();
let transporter: nodemailer.Transporter | null = null;

if (
  process.env.SMTP_HOST &&
  process.env.SMTP_PORT &&
  process.env.SMTP_USER &&
  process.env.SMTP_PASS
) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  console.log("📬 SMTP configured");
} else {
  console.warn("⚠ SMTP not configured. Email alerts disabled.");
}

export default async function sendMail(payload: {
  monitorId: number;
  endpoint: string;
  latency: number;
  statusCode: number | null;
  failureCount: number;
  timestamp: number;
}) {
  if (!transporter) return;

  const emails = getAlertEmails();
  if (!emails.length) {
    console.warn(
      "💢💢💢💢 You didn't put the mail to be notified at 💢💢💢💢!!!",
    );
    return;
  }
  const date = new Date(payload.timestamp);

  const utcTime = date.toUTCString();
  const timezone = process.env.OWLOPS_TIMEZONE;
  const localTime = date.toLocaleString("en-US", {
    timeZone: timezone || undefined,
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: emails.join(","),
    subject: `[OWLOPS ALERT] ${payload.endpoint} failing`,
    text: `
🦉 OWLOPS ALERT — Endpoint Down

Endpoint: ${payload.endpoint}
Status: ${payload.statusCode ?? "No Response"}
Latency: ${payload.latency}ms
Failures: ${payload.failureCount}

Detected At:
• UTC:   ${utcTime}
• Local: ${localTime}
`,
  });
  console.log("📨 Alert email sent");
}
