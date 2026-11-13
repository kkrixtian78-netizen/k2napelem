type TopicId = 'napelem' | 'villany' | 'futes';

const SIGNATURE = `Kántor Krisztián
K2Napelem
+36 30 2677 665
k2@k2napelem.hu
k2napelem.hu
2017 Pócsmegyer, Táncsics út 10.`;

export function quoteMailSubject(topic: TopicId): string {
  if (topic === 'villany') return 'K2 villanyszerelési árajánlat';
  if (topic === 'futes') return 'K2 fűtés árajánlat';
  return 'K2 napelemes árajánlat';
}

function offerPhrase(topic: TopicId): string {
  if (topic === 'villany') return 'a villanyszerelési munka árajánlatát';
  if (topic === 'futes') return 'az elektromos fűtés árajánlatát';
  return 'a leendő napelemes rendszere árajánlatát';
}

export function quoteMailBody(customerName: string, topic: TopicId): string {
  const name = customerName.trim() || 'Ügyfelünk';
  return `Kedves ${name}

Előzetes egyeztetésünk alapján mellékelve küldöm ${offerPhrase(topic)}.

Kérdés esetén hívjon/írjon!

Várom válaszát!

${SIGNATURE}`;
}

function quoteField(value: string): string {
  return `'${value.replace(/'/g, '’')}'`;
}

/** Thunderbird -compose argumentum: címzett, tárgy, szöveg, melléklet. */
export function thunderbirdComposeArg(input: {
  to: string;
  subject: string;
  body: string;
  attachment: string;
}): string {
  return [
    `to=${quoteField(input.to)}`,
    `subject=${quoteField(input.subject)}`,
    `body=${quoteField(input.body)}`,
    `attachment=${quoteField(input.attachment)}`,
  ].join(',');
}

export function mailtoHref(to: string, subject: string, body: string): string {
  const address = to.trim();
  return `mailto:${address}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
