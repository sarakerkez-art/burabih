import { createServerFn } from "@tanstack/react-start";

export type AdviceResult = { ok: boolean; text: string; error?: string };

function timeOfDay(hour: number, lang: "bs" | "en"): string {
  if (lang === "bs") {
    if (hour < 6) return "rano jutro";
    if (hour < 11) return "jutro";
    if (hour < 16) return "podne";
    if (hour < 20) return "popodne";
    return "veče";
  }
  if (hour < 6) return "early morning";
  if (hour < 11) return "morning";
  if (hour < 16) return "midday";
  if (hour < 20) return "afternoon";
  return "evening";
}

export const fetchAdvice = createServerFn({ method: "POST" })
  .inputValidator((d: {
    city: string;
    heating: string;
    children: string;
    pm25: number | null;
    temp: number | null;
    hour: number;
    lang: "bs" | "en";
  }) => d)
  .handler(async ({ data }): Promise<AdviceResult> => {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) return { ok: false, text: "", error: "Missing ANTHROPIC_API_KEY" };

    const pm = data.pm25 != null ? data.pm25.toFixed(0) : "nepoznato";
    const temp = data.temp != null ? `${data.temp}°C` : "nepoznata";
    const tod = timeOfDay(data.hour, data.lang);

    let toneRule = "";
    if (data.pm25 != null) {
      if (data.pm25 < 15) toneRule = "Zrak je čist, koristi prijateljski i pozitivan ton.";
      else if (data.pm25 <= 35) toneRule = "Zrak je umjeren, koristi oprezan ton sa praktičnim mjerama predostrožnosti.";
      else toneRule = "Zrak je jako zagađen, koristi hitan zaštitnički ton, fokus na zaštitu djece i ranjivih.";
    }

    const prompt = `Ti si Buri, AI asistent za kvalitet zraka u BiH. PM2.5 u ${data.city} je ${pm} µg/m³, temperatura je ${temp}, doba dana je ${tod}, grijanje: ${data.heating}, djeca: ${data.children}.
Napiši 3 konkretna savjeta na bosanskom za ovu porodicu danas. Budi specifican sa vremenima. Maksimalno 100 rijeci.
${toneRule}
Bez crtica (—). Bez uvoda. Vrati samo numerisanu listu 1. 2. 3.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 600,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        return { ok: false, text: "", error: `Anthropic ${res.status}: ${t.slice(0, 200)}` };
      }
      const j: any = await res.json();
      const text: string = (j?.content?.[0]?.text ?? "").trim();
      if (!text) return { ok: false, text: "", error: "Empty response" };
      return { ok: true, text };
    } catch (e: any) {
      return { ok: false, text: "", error: String(e?.message ?? e) };
    }
  });
