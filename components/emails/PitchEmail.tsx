import {
  Body,
  Container,
  Head,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface PitchEmailProps {
  recipientName?: string;
  senderName?: string;
  phoneNumber?: string;
  companyName?: string;
}

export const PitchEmail = ({
  recipientName = "Fernando",
  senderName = "Jan Korczynski",
  phoneNumber = "+48 791 633 136", // Replace with your actual phone number
  companyName = "FromMexico",
}: PitchEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Premium Hass Avocados directly from Mexico</Preview>
      <Body style={main}>
        <Container style={container}>
          <Text style={paragraph}>Hi {recipientName},</Text>
          
          <Text style={paragraph}>
            I hope this email finds you well.
          </Text>

          <Text style={paragraph}>
            My name is {senderName.split(' ')[0]}, and I manage sales operations at {companyName}. We specialize in sourcing premium Hass avocados directly from the best growing regions in Mexico, ensuring they reach European cold stores with the highest quality and freshness.
          </Text>
          
          <Text style={paragraph}>
            We have a fresh supply ready to ship, and I would love to discuss how we can support your upcoming volume requirements. You can review our process and <Link href="https://www.xn--frommxico-f4a.com/#contact" style={link}>request a direct quote on our website</Link>.
          </Text>

          <Text style={paragraph}>
            Are you available for a brief call next week to discuss? Feel free to reach out to me directly at the number below.
          </Text>

          <Text style={paragraph}>
            Best regards,
          </Text>

          {/* Corporate Signature */}
          <Section style={signatureBlock}>
            <Text style={signatureName}>{senderName}</Text>
            <Text style={signatureTitle}>Sales & Operations</Text>
            
            <table cellPadding={0} cellSpacing={0} style={signatureTable}>
              <tbody>
                <tr>
                  <td style={{ paddingRight: "12px", borderRight: "1px solid #d4d4d8" }}>
                    <Text style={signatureCompany}>{companyName}</Text>
                  </td>
                  <td style={{ paddingLeft: "12px" }}>
                    <Text style={signatureDetails}>
                      <Link href={`tel:${phoneNumber.replace(/\s+/g, '')}`} style={signatureLink}>{phoneNumber}</Link>
                      <br />
                      <Link href="https://www.xn--frommxico-f4a.com/" style={signatureLink}>fromméxico.com</Link>
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Invisible Anti-Spam Footer (Required but unobtrusive) */}
          <Text style={footerText}>
            {companyName} • Mexico City, Mexico
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default PitchEmail;

// --- STYLES ---

const main = {
  backgroundColor: "#ffffff",
  fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  width: "580px",
  maxWidth: "100%",
};

const paragraph = {
  fontSize: "15px",
  lineHeight: "24px",
  color: "#333333",
  margin: "0 0 16px",
};

const link = {
  color: "#0D9488",
  textDecoration: "underline",
};

const signatureBlock = {
  marginTop: "32px",
  paddingTop: "16px",
};

const signatureName = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#111827",
  margin: "0 0 2px",
};

const signatureTitle = {
  fontSize: "14px",
  color: "#4b5563",
  margin: "0 0 12px",
};

const signatureTable = {
  marginTop: "8px",
};

const signatureCompany = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#0D9488", // Brand color
  margin: "0",
  letterSpacing: "-0.5px",
};

const signatureDetails = {
  fontSize: "13px",
  color: "#6b7280",
  lineHeight: "18px",
  margin: "0",
};

const signatureLink = {
  color: "#6b7280",
  textDecoration: "none",
};

const footerText = {
  fontSize: "11px",
  color: "#d1d5db",
  marginTop: "48px",
};
