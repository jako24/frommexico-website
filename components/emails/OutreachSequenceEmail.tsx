import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";
import { SITE_URL, sender } from "@/lib/outreach/config";
import copy from "@/lib/copy";
import type { SequenceEmail } from "@/lib/outreach/sequence";
import type { Lead } from "@/lib/outreach/types";

interface OutreachSequenceEmailProps {
  lead: Lead;
  email: SequenceEmail;
  unsubscribeHref: string;
}

export function OutreachSequenceEmail({
  lead,
  email,
  unsubscribeHref,
}: OutreachSequenceEmailProps) {
  const closing =
    lead.language === "es"
      ? "Un saludo,"
      : lead.language === "en"
        ? "Kind regards,"
        : "Z poważaniem,";
  const optOut =
    lead.language === "es"
      ? "Si este mensaje no es relevante, puede darse de baja aquí:"
      : lead.language === "en"
        ? "If this is not relevant, you can opt out here:"
        : "Jeśli ta wiadomość nie jest dla Państwa istotna, rezygnacja:";
  const logoSrc = `${SITE_URL}/email-logo.png`;

  return (
    <Html>
      <Head />
      <Preview>{email.preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {email.paragraphs.map((paragraph) => (
            <Text key={paragraph} style={paragraphStyle}>
              {paragraph}
            </Text>
          ))}
          <Text style={paragraphStyle}>{closing}</Text>
          <Text style={signatureName}>{sender.name}</Text>
          <Text style={signatureMeta}>
            {sender.title}
            <br />
            {sender.company}
            <br />
            <Link href={`tel:${sender.phone.replace(/\s+/g, "")}`} style={link}>
              {sender.phone}
            </Link>
          </Text>

          <Hr style={hr} />

          <Section style={brandBlock}>
            <Img
              src={logoSrc}
              width="48"
              height="48"
              alt={sender.company}
              style={logo}
            />
            <Text style={brandName}>{sender.company}</Text>
            <Text style={tagline}>{copy.brand.tagline}</Text>
            <Text style={brandLinks}>
              <Link href={sender.website} style={link}>
                {sender.website.replace(/^https:\/\//, "")}
              </Link>
            </Text>
            <Text style={brandContact}>
              {sender.email} · {sender.phone}
            </Text>
          </Section>

          <Text style={footer}>
            {sender.company} · {sender.address}
            <br />
            {optOut}{" "}
            <Link href={unsubscribeHref} style={link}>
              {lead.language === "es"
                ? "darse de baja"
                : lead.language === "en"
                  ? "unsubscribe"
                  : "wypisz się"}
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

export default OutreachSequenceEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "8px 0 32px",
  width: "580px",
  maxWidth: "100%",
};

const paragraphStyle = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#1C1917",
  margin: "0 0 16px",
};

const signatureName = {
  fontSize: "15px",
  fontWeight: "bold" as const,
  color: "#1C1917",
  margin: "0 0 4px",
};

const signatureMeta = {
  fontSize: "13px",
  lineHeight: "20px",
  color: "#57534E",
  margin: "0",
};

const link = {
  color: "#0D9488",
  textDecoration: "underline",
};

const hr = {
  borderColor: "#E7E5E4",
  margin: "28px 0 20px",
};

const brandBlock = {
  textAlign: "center" as const,
};

const logo = {
  margin: "0 auto 8px",
  display: "block" as const,
};

const brandName = {
  fontSize: "18px",
  fontWeight: "bold" as const,
  color: "#1C1917",
  margin: "0 0 4px",
};

const tagline = {
  fontSize: "13px",
  lineHeight: "18px",
  color: "#78716C",
  margin: "0 0 8px",
};

const brandLinks = {
  fontSize: "13px",
  margin: "0 0 4px",
};

const brandContact = {
  fontSize: "12px",
  lineHeight: "18px",
  color: "#78716C",
  margin: "0",
};

const footer = {
  fontSize: "12px",
  lineHeight: "18px",
  color: "#78716C",
  margin: "24px 0 0",
  textAlign: "center" as const,
};
