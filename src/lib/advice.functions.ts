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

const CYR_MAP: Record<string, string> = {
  а:"a",б:"b",в:"v",г:"g",д:"d",ђ:"đ",е:"e",ж:"ž",з:"z",и:"i",ј:"j",к:"k",л:"l",љ:"lj",м:"m",
  н:"n",њ:"nj",о:"o",п:"p",р:"r",с:"s",т:"t",ћ:"ć",у:"u",ф:"f",х:"h",ц:"c",ч:"č",џ:"dž",ш:"š",
  А:"A",Б:"B",В:"V",Г:"G",Д:"D",Ђ:"Đ",Е:"E",Ж:"Ž",З:"Z",И:"I",Ј:"J",К:"K",Л:"L",Љ:"Lj",М:"M",
  Н:"N",Њ:"Nj",О:"O",П:"P",Р:"R",С:"S",Т:"T",Ћ:"Ć",У:"U",Ф:"F",Х:"H",Ц:"C",Ч:"Č",Џ:"Dž",Ш:"Š",
};
function cyrillicToLatin(s: string): string {
  return s.replace(/[\u0400-\u04FF]/g, (ch) => CYR_MAP[ch] ?? ch);
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

    const isEn = data.lang === "en";
    const pm = data.pm25 != null ? data.pm25.toFixed(0) : (isEn ? "unknown" : "nepoznato");
    const temp = data.temp != null ? `${data.temp}°C` : (isEn ? "unknown" : "nepoznata");
    const tod = timeOfDay(data.hour, data.lang);

    let toneRule = "";
    if (data.pm25 != null) {
      if (isEn) {
        if (data.pm25 < 15) toneRule = "Air is clean, use a friendly and positive tone.";
        else if (data.pm25 <= 35) toneRule = "Air is moderate, use a cautious tone with practical precautions.";
        else toneRule = "Air is heavily polluted, use an urgent protective tone, focus on protecting children and vulnerable people.";
      } else {
        if (data.pm25 < 15) toneRule = "Zrak je čist, koristi prijateljski i pozitivan ton.";
        else if (data.pm25 <= 35) toneRule = "Zrak je umjeren, koristi oprezan ton sa praktičnim mjerama predostrožnosti.";
        else toneRule = "Zrak je jako zagađen, koristi hitan zaštitnički ton, fokus na zaštitu djece i ranjivih.";
      }
    }

    const prompt = isEn
      ? `You are Buri, an AI air-quality assistant for Bosnia and Herzegovina. PM2.5 in ${data.city} is ${pm} µg/m³, temperature is ${temp}, time of day is ${tod}, heating: ${data.heating}, children: ${data.children}.
Write 3 concrete pieces of advice in English for this family today. Be specific with times. Maximum 100 words.
${toneRule}
No dashes (—). No intro. Return only a numbered list 1. 2. 3.`
      : `Ti si Buri, AI asistent za kvalitet zraka u BiH. PM2.5 u ${data.city} je ${pm} µg/m³, temperatura je ${temp}, doba dana je ${tod}, grijanje: ${data.heating}, djeca: ${data.children}.
Napiši 3 konkretna savjeta na bosanskom jeziku za ovu porodicu danas. Budi specifican sa vremenima. Maksimalno 100 rijeci.
${toneRule}
VAŽNO: Piši ISKLJUČIVO latinicom (bosanska latinica: č, ć, š, ž, đ). NIKADA ne koristi ćirilicu ni jedno slovo. Bez crtica (—). Bez uvoda. Vrati samo numerisanu listu 1. 2. 3.`;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": key,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        const message = `Anthropic ${res.status}: ${t}`;
        console.error("[advice] Exact error:", message);
        console.error("[advice] Full API response:", t);
        const error = new Error(message) as Error & { status?: number; apiResponse?: string };
        error.status = res.status;
        error.apiResponse = t;
        throw error;
      }
      const j: any = await res.json();
      console.log("[advice] Full API response:", JSON.stringify(j));
      let text: string = (j?.content?.[0]?.text ?? "").trim();
      text = cyrillicToLatin(text);
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
