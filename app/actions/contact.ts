"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface ContactData {
  name: string;
  company: string;
  email: string;
  country: string;
  product: string;
  volume: string;
  message: string;
}

export async function sendContactEmail(data: ContactData) {
  try {
    const toEmail = process.env.CONTACT_EMAIL_TO;

    if (!toEmail) {
      console.warn("CONTACT_EMAIL_TO is not set in environment variables");
      return { success: false, error: "Email configuration missing." };
    }
    
    // For Resend testing/development without a domain, the 'from' address must be onboarding@resend.dev
    const fromEmail = process.env.CONTACT_EMAIL_FROM || "onboarding@resend.dev";

    const response = await resend.emails.send({
      from: `From Mexico Contact <${fromEmail}>`,
      to: [toEmail],
      subject: `New Inquiry from ${data.name} at ${data.company}`,
      replyTo: data.email,
      html: `
        <h2>New Contact Request - From Mexico</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Company:</strong> ${data.company}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Country:</strong> ${data.country}</p>
        <p><strong>Product Interest:</strong> ${data.product}</p>
        <p><strong>Estimated Volume:</strong> ${data.volume}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message.replace(/\n/g, "<br>")}</p>
      `,
    });

    if (response.error) {
      console.error("Resend error:", response.error);
      return { success: false, error: response.error.message || "Failed to send email." };
    }

    return { success: true };
  } catch (err: any) {
    console.error("Server action error:", err);
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}
