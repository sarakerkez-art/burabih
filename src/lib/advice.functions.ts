import { createServerFn } from "@tanstack/react-start";

export type AdviceItem = { title: string; tag: string; text: string };
export type AdviceResult = { ok: boolean; items: AdviceItem[]; error?: string };

export const fetchAdvice = createServerFn({ method: "POST" })
  .inputValidator((d: {
    city: string;
    heating: string;
    children: string;
    pm25: number | null;
    lang: "bs" | "en";
  }) => d)
  .handler(async ({ data }): Promise<AdviceResult> => {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) return { ok: false, items: [], error: "Missing ANTHROPIC_API_KEY" };

    const lang = data.lang === "bs" ? "Bosnian" : "English";
    const pm = data.pm25 != null ? `${data.pm25.toFixed(0)} µg/m³` : "unknown";

    const prompt = `You are an air quality advisor for parents in Bosnia and Herzegovina. Generate 2-3 specific, warm, human-sounding actions a family should take TODAY based on:
- City: ${data.city}
- Heating: ${data.heating}
- Children: ${data.children}
- Current PM2.5: ${pm}

Write in ${lang}. Be concrete (specific times, durations). No em-dashes. No AI clichés. Friendly, neighborly tone.

Return ONLY valid JSON, no prose, no markdown fences:
{"items":[{"title":"...","tag":"SHORT UPPERCASE LABEL","text":"1-2 sentences of practical advice"}]}`;

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
          max_tokens: 800,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (!res.ok) {
        const t = await res.text();
        return { ok: false, items: [], error: `Anthropic ${res.status}: ${t.slice(0, 200)}` };
      }
      const j: any = await res.json();
      const text: string = j?.content?.[0]?.text ?? "";
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) return { ok: false, items: [], error: "No JSON in response" };
      const parsed = JSON.parse(match[0]);
      const items = Array.isArray(parsed?.items) ? parsed.items : [];
      return { ok: true, items };
    } catch (e: any) {
      return { ok: false, items: [], error: String(e?.message ?? e) };
    }
  });
