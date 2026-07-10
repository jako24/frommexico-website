import { NextResponse } from "next/server";
import { Resend } from "resend";
import PitchEmail from "@/components/emails/PitchEmail";
import * as React from "react";
import { render } from "@react-email/components";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const to = searchParams.get("to") || "korczynskijanek24@gmail.com";
    
    const fromEmail = process.env.CONTACT_EMAIL_FROM || "onboarding@resend.dev";

    const htmlContent = await render(React.createElement(PitchEmail, {
      senderName: "Janek Korczynski",
      phoneNumber: "+48 123 456 789", // Feel free to update this in the code
      recipientName: "there",
    }));

    const { data, error } = await resend.emails.send({
      from: `FromMexico <${fromEmail}>`,
      to: [to],
      replyTo: process.env.CONTACT_EMAIL_TO,
      subject: "Premium Hass Avocados directly from Mexico",
      html: htmlContent,
    });

    if (error) {
      console.error("Resend API Error:", error);
      return NextResponse.json({ error: error.message || error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Server Route Error:", error);
    return NextResponse.json({ error: error.message || "Unknown error" }, { status: 500 });
  }
}
