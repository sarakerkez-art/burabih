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
    console.log("[advice] ANTHROPIC_API_KEY defined:", Boolean(key));
    if (!key) {
      console.error("[advice] Exact error: Missing ANTHROPIC_API_KEY");
      return { ok: false, text: "", error: "Missing ANTHROPIC_API_KEY" };
    }

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
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        const message = `Anthropic ${res.status}: ${t}`;
        console.error("[advice] Exact error:", message);
        console.error("[advice] Full API response:", t);
        return { ok: false, text: "", error: `Anthropic ${res.status}: ${t.slice(0, 300)}` };
      }
      const j: any = await res.json();
      console.log("[advice] Full API response:", JSON.stringify(j));
      const text: string = (j?.content?.[0]?.text ?? "").trim();
      if (!text) {
        console.error("[advice] Exact error: Empty response");
        console.error("[advice] Full API response:", JSON.stringify(j));
        return { ok: false, text: "", error: "Empty response" };
      }
      return { ok: true, text };
    } catch (error: any) {
      console.log('[advice] Error type:', error?.constructor?.name);
      console.log('[advice] Error message:', error?.message);
      console.log('[advice] Full error:', JSON.stringify(error, null, 2));
      console.log('[advice] Status:', error?.status);
      console.error("[advice] Exact error:", String(error?.message ?? error));
      console.error("[advice] Full API response: No response received", error);
      return { ok: false, text: "", error: String(error?.message ?? error) };
    }
  });
