import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const Schema = z.object({
  email: z.string().trim().email().max(255),
  city: z.string().trim().max(120).optional().nullable(),
});

export const joinWaitlist = createServerFn({ method: "POST" })
  .inputValidator((input) => Schema.parse(input))
  .handler(async ({ data }) => {
    const email = data.email.toLowerCase();
    const city = data.city ?? null;

    // Upsert by email; ignore unique conflict so users can re-submit.
    const { error } = await supabaseAdmin
      .from("waitlist")
      .upsert({ email, city }, { onConflict: "email" });

    if (error) {
      console.error("[waitlist] insert error", error);
      throw new Error("Failed to save signup");
    }

    // Send confirmation email via Resend if configured.
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const LOVABLE_API_KEY = process.env.LOVABLE_API_KEY;
    if (RESEND_API_KEY && LOVABLE_API_KEY) {
      try {
        const res = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": RESEND_API_KEY,
          },
          body: JSON.stringify({
            from: "Bura <contact@burabih.org>",
            to: [email],
            subject: "Hvala! Buri te čeka 🌬️",
            text: `Dragi/Draga,

hvala što si se prijavio/la za Bura jutarnje obavijesti.

Bura je trenutno u fazi razvoja. Bit ćeš među prvima koji dobiju Burijeve jutarnje poruke kada pokrenemo platformu.

Do tada, možeš pratiti naš napredak na burabih.org

Hvala što vjeruješ u čišći zrak za BiH.

Buri i tim Bura
contact@burabih.org`,
            html: `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.6;color:#1a1a1a;max-width:560px;margin:0 auto;padding:24px">
              <p>Dragi/Draga,</p>
              <p>hvala što si se prijavio/la za <strong>Bura</strong> jutarnje obavijesti.</p>
              <p>Bura je trenutno u fazi razvoja. Bit ćeš među prvima koji dobiju Burijeve jutarnje poruke kada pokrenemo platformu.</p>
              <p>Do tada, možeš pratiti naš napredak na <a href="https://burabih.org" style="color:#1f6b4a">burabih.org</a>.</p>
              <p>Hvala što vjeruješ u čišći zrak za BiH.</p>
              <p style="margin-top:24px">Buri i tim Bura<br/><a href="mailto:contact@burabih.org" style="color:#1f6b4a">contact@burabih.org</a></p>
            </div>`,
          }),
        });
        if (!res.ok) {
          const body = await res.text();
          console.error("[waitlist] resend send failed", res.status, body);
        }

        // Also notify the Bura team inbox.
        try {
          const notifyRes = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "X-Connection-Api-Key": RESEND_API_KEY,
            },
            body: JSON.stringify({
              from: "Bura <contact@burabih.org>",
              to: ["contact@burabih.org"],
              reply_to: email,
              subject: "New Bura signup",
              text: `New Bura signup\n\nEmail: ${email}\nCity: ${city ?? "(not provided)"}\nTimestamp: ${new Date().toISOString()}`,
              html: `<div style="font-family:Arial,sans-serif;font-size:14px;line-height:1.6;color:#1a1a1a">
                <h2 style="margin:0 0 12px">New Bura signup</h2>
                <p style="margin:0"><strong>Email:</strong> ${email}</p>
                <p style="margin:0"><strong>City:</strong> ${city ?? "(not provided)"}</p>
                <p style="margin:0"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
              </div>`,
            }),
          });
          if (!notifyRes.ok) {
            const body = await notifyRes.text();
            console.error("[waitlist] notify send failed", notifyRes.status, body);
          }
        } catch (err) {
          console.error("[waitlist] notify error", err);
        }
      } catch (err) {
        console.error("[waitlist] resend error", err);
      }
    } else {
      console.warn("[waitlist] Resend not configured — skipping confirmation email");
    }

    return { ok: true };
  });
