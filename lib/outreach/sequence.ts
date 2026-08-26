import { DAILY_SEND_CAP, SEQUENCE_DELAYS_DAYS, SITE_URL, sender } from "./config";
import type { Lead, LeadLanguage } from "./types";

export const TOTAL_STEPS = 3;

export interface SequenceEmail {
  step: number;
  subject: string;
  preview: string;
  paragraphs: string[];
}

function greeting(lead: Lead, language: LeadLanguage) {
  const name = lead.contactName.trim();
  if (language === "es") {
    return name ? `Hola ${name},` : "Hola,";
  }
  if (language === "en") {
    return name ? `Hello ${name},` : "Hello,";
  }
  return name ? `Dzień dobry ${name},` : "Dzień dobry,";
}

function productLine(lead: Lead, language: LeadLanguage) {
  const noted = lead.productsNoted.trim();
  if (noted) {
    return noted;
  }
  if (language === "es") {
    return "mango y aguacate";
  }
  return "mango and avocado";
}

function isMexico(lead: Lead) {
  const n = (lead.country || "").toLowerCase();
  return n.includes("mexico") || n.includes("méxico") || n === "mx";
}

function destination(lead: Lead, language: LeadLanguage) {
  if (language === "es") {
    if (isMexico(lead)) {
      return "hacia Europa";
    }
    if (lead.city.trim()) {
      return `a ${lead.city}`;
    }
    return "a Europa";
  }
  if (lead.city.trim()) {
    return language === "en" ? `into ${lead.city}` : `do ${lead.city}`;
  }
  if (lead.country.trim() && !isMexico(lead)) {
    return language === "en" ? `into ${lead.country}` : `do ${lead.country}`;
  }
  return language === "en" ? "into Europe" : "do Europy";
}

function companyLabel(lead: Lead, language: LeadLanguage) {
  if (lead.companyName.trim()) {
    return lead.companyName;
  }
  if (language === "es") {
    return "su equipo de compras";
  }
  if (language === "en") {
    return "your buying team";
  }
  return "Państwa firmy";
}

export function closingLine(language: LeadLanguage) {
  if (language === "es") {
    return "Un saludo,";
  }
  if (language === "en") {
    return "Kind regards,";
  }
  return "Z poważaniem,";
}

export function buildSequenceEmail(lead: Lead, step = lead.sequenceStep + 1): SequenceEmail {
  const language = lead.language;
  const company = companyLabel(lead, language);
  const products = productLine(lead, language);
  const dest = destination(lead, language);
  const hello = greeting(lead, language);

  if (language === "es") {
    if (step === 1) {
      return {
        step,
        subject: `${company}: Hass y Kent de México ${dest} — 14–18 días`,
        preview: "Fruta directa de packing house. Basta una línea para responder.",
        paragraphs: [
          hello,
          `Soy Jan, de FromMexico. Enviamos aguacate Hass (Michoacán) y mango Kent / Ataulfo (Chiapas) ${dest} — líneas que ya trabajan con ${products}.`,
          "El fruto se preenfría en cuatro horas, clase I, atmósfera controlada, con orgánico UE, GLOBALG.A.P. y fitosanitario listos antes de Rotterdam, Amberes o Gdansk.",
          "Si el origen mexicano entra en el próximo programa, responda con un volumen semanal — o «no esta temporada» y cierro el expediente.",
        ],
      };
    }
    if (step === 2) {
      return {
        step,
        subject: `Re: ${company} — calibre, puerto y MOQ`,
        preview: "Cotizo su especificación, no un catálogo.",
        paragraphs: [
          hello,
          `Retomo Hass y Kent ${dest}. Puedo cotizar calibre (p. ej. aguacate 20–22), caja, punto de maduración y puerto.`,
          "Basta una línea. Si el momento no es ahora, dígalo y me detengo.",
        ],
      };
    }
    return {
      step,
      subject: `Cierro el hilo — FromMexico / ${company}`,
      preview: "Última nota sobre aguacate y mango mexicano.",
      paragraphs: [
        hello,
        "No insistiré más. Si el Hass o Kent mexicano vuelve a la lista, escriba a esta dirección y envío lotes y tránsito actuales.",
        `También puede usar el formulario en ${SITE_URL}#contact.`,
      ],
    };
  }

  if (language === "en") {
    if (step === 1) {
      return {
        step,
        subject: `${company}: Hass avocado and Kent mango, Mexico to EU in 14–18 days`,
        preview: "Direct packing-house fruit. One line is enough to reply.",
        paragraphs: [
          hello,
          `I am Jan at FromMexico. We ship Hass avocado (Michoacán) and Kent / Ataulfo mango (Chiapas) ${dest} — the same lines I see you already list (${products}).`,
          "Fruit is pre-cooled within four hours, Class I, controlled atmosphere, with EU organic, GLOBALG.A.P. and phytosanitary papers ready before Rotterdam, Antwerp or Gdańsk.",
          "If Mexican origin is on the next programme, reply with a weekly volume — or “not this season” and I will close the file.",
        ],
      };
    }
    if (step === 2) {
      return {
        step,
        subject: `Re: ${company} — calibre, port and MOQ`,
        preview: "I can price your spec, not a catalogue.",
        paragraphs: [
          hello,
          `Following up on Hass and Kent ${dest}. I can quote calibre (e.g. avocado 20–22), carton, ripening stage and port.`,
          "One line is enough. If the timing is wrong, say so and I stop.",
        ],
      };
    }
    return {
      step,
      subject: `Closing the note — FromMexico / ${company}`,
      preview: "Last note from me on Mexican avocado and mango.",
      paragraphs: [
        hello,
        "I will not chase this further. If Mexican Hass or Kent comes back onto the list, write to this address and I will send current lots and transit times.",
        `You can also use the quote form on ${SITE_URL}#contact.`,
      ],
    };
  }

  if (step === 1) {
    return {
      step,
      subject: `${company}: Hass i Kent z Meksyku ${dest} — 14–18 dni`,
      preview: "Bezpośrednio z packing house. Wystarczy jedna linia.",
      paragraphs: [
        hello,
        `Nazywam się Jan, FromMexico. Wysyłamy avocado Hass (Michoacán) i mango Kent / Ataulfo (Chiapas) ${dest} — w asortymencie widzę m.in. ${products}.`,
        "Owoc schładzany w ciągu czterech godzin, klasa I, kontrolowana atmosfera. Organic UE, GLOBALG.A.P. i świadectwo fitosanitarne przed wejściem do Rotterdamu, Antwerpii albo Gdańska.",
        "Jeśli meksykańskie pochodzenie jest na stole, proszę o tygodniową ilość — albo „nie w tym sezonie”, to zamykam kontakt.",
      ],
    };
  }

  if (step === 2) {
    return {
      step,
      subject: `Re: ${company} — kaliber, port i MOQ`,
      preview: "Wycena pod specyfikację, nie pod katalog.",
      paragraphs: [
        hello,
        `Wracam krótko w sprawie Hass i Kent ${dest}. Mogę wycenić kaliber (np. avocado 20–22), karton, stadium dojrzewania i port.`,
        "Wystarczy jedna linia. Jeśli to nie jest temat na ten kwartał — napiszcie, zatrzymuję wysyłkę.",
      ],
    };
  }

  return {
    step,
    subject: `Zamykam wątek — FromMexico / ${company}`,
    preview: "Ostatnia wiadomość w sprawie mango i awokado z Meksyku.",
    paragraphs: [
      hello,
      "Nie chcę dublować skrzynki. Jeśli wrócą Państwo do tematu meksykańskiego Hass albo Kent, napiszcie na ten adres — podeślę aktualne partie i czas tranzytu.",
      `Można też skorzystać z formularza na ${SITE_URL}#contact.`,
    ],
  };
}

export function unsubscribeUrl(lead: Lead) {
  return `${SITE_URL}/unsubscribe?token=${encodeURIComponent(lead.unsubscribeToken)}`;
}

export function signatureLines() {
  return [
    sender.name,
    sender.title,
    sender.company,
    sender.phone,
    sender.website,
  ];
}

export function nextSendDate(from: Date, delayDays: number) {
  const next = new Date(from);
  next.setUTCDate(next.getUTCDate() + delayDays);
  return next.toISOString();
}

export function sentTodayCount(leads: Lead[], now = new Date()) {
  const start = new Date(now);
  start.setUTCHours(0, 0, 0, 0);
  return leads.filter((lead) => lead.lastSentAt && new Date(lead.lastSentAt) >= start)
    .length;
}

export function dueLeads(leads: Lead[], now = new Date()) {
  return leads.filter((lead) => {
    if (lead.status !== "active") {
      return false;
    }
    if (lead.sequenceStep >= TOTAL_STEPS) {
      return false;
    }
    if (!lead.nextSendAt) {
      return false;
    }
    return new Date(lead.nextSendAt) <= now;
  });
}

export function remainingDailyCapacity(leads: Lead[], now = new Date()) {
  return Math.max(0, DAILY_SEND_CAP - sentTodayCount(leads, now));
}

export function delayForStep(nextStep: number) {
  const index = Math.min(Math.max(nextStep - 1, 0), SEQUENCE_DELAYS_DAYS.length - 1);
  return SEQUENCE_DELAYS_DAYS[index];
}
