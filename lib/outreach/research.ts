export function researchLinks(companyName: string, city = "") {
  const place = city ? ` ${city}` : " Polska";
  const base = companyName.trim() || "hurtownia owoców mango awokado";
  const q = (query: string) =>
    `https://www.google.com/search?q=${encodeURIComponent(query)}`;

  return [
    {
      label: "Company contact page",
      href: q(`${base}${place} kontakt OR biuro OR zakup`),
    },
    {
      label: "Produce / import keywords",
      href: q(`${base} mango OR awokado OR owoce egzotyczne hurt`),
    },
    {
      label: "LinkedIn buying roles",
      href: q(`site:linkedin.com ${base} zakup OR category OR fresh produce`),
    },
    {
      label: "Trade fair exhibitor lists",
      href: q(`${base} Fruit Logistica OR Polagra OR WorldFood Warsaw`),
    },
  ];
}

export const researchPlaybook = [
  {
    title: "Use lists you already have a right to use",
    body: "Start with buyers who wrote to you, met you, downloaded a spec, or listed a commercial purchasing email on their own site. Import those rows here. Do not paste scraped consumer inboxes or guessed name@company addresses.",
  },
  {
    title: "Aim at the buyer, not “BIURO”",
    body: "Generic office inboxes file cold mail as noise. Look for category, fresh produce, import or purchasing on the company’s own contact page or LinkedIn, then add that person by name.",
  },
  {
    title: "Send from frommexico.com, not Gmail",
    body: "Personal Gmail plus a long pitch is why these messages die. Authenticate the domain in Resend (SPF, DKIM, DMARC) and use CONTACT_EMAIL_FROM on your domain.",
  },
  {
    title: "Stay inside EU commercial-email rules",
    body: "Polish and EU rules are strict. Only email companies with a genuine wholesale interest, say who you are, include a working opt-out, and stop on the first no. This desk will not harvest the web for you.",
  },
];
