## Plan: Add /partner (BHS) and /en/partner (EN) pages

### Routes
- `src/routes/partner.tsx` → renders shared `PartnerPage` with `lang="bs"`
- `src/routes/en.partner.tsx` → renders shared `PartnerPage` with `lang="en"`
- Each route sets its own `head()` (BHS / EN title + description + og tags)
- Language toggle in the header swaps between the two routes via `<Link>` (BHS ↔ EN), replacing the in-page `setLang` pattern used elsewhere so the URLs you specified are real

### Shared component
- `src/components/PartnerPage.tsx` accepts `lang: "bs" | "en"` and renders all 6 sections
- Reuses existing chrome: `WindMark`, `MobileNav`, same header/footer pattern as `vizija.tsx`
- All copy comes from a `partner` block I'll add to `src/lib/i18n.ts` (BHS + EN) — left as empty placeholders until you send the content
- No em dashes anywhere (use commas, periods, or " - " hyphens)

### Design tokens (already in styles.css)
- Font: DM Sans (already global)
- Background: `--offwhite` (#FAFAF8)
- Headlines: `--forest` (#1A2E1A)
- Accent: `--amber-brand` (#E8A030)
- Icon chips: sage-green box `bg-[color:var(--sage)] text-[color:var(--forest)]` w/ Lucide icons
- Hero uses `bg-[color:var(--teal-brand)]` full-bleed

### Section scaffolding (content TBD from you)
1. Hero — full-width teal band, headline + sub + CTA slot
2. Why Now — stat row + body text column
3. What is Bura — 3 stat badges in a row
4. Who Can Help — 2x2 card grid, each card with sage icon chip + title + body
5. Contact Form — fields: name, email, type (Select dropdown), message; submits to Supabase `partner_interest`
6. Footer quote — centered italic quote band, same site footer below

### Contact form → Supabase
- New table `public.partner_interest`:
  - `id uuid pk default gen_random_uuid()`
  - `name text not null`
  - `email text not null`
  - `type text not null`
  - `message text not null`
  - `created_at timestamptz not null default now()`
- RLS enabled, single policy: `anyone (anon, authenticated) can INSERT` (mirrors existing `waitlist` / `schools` tables). No SELECT/UPDATE/DELETE.
- Client validation with Zod (email format, length caps 1..2000)
- Submit via `supabase.from("partner_interest").insert(...)` from the browser (matches existing waitlist pattern via the public client)
- On success: replace form with a sage success card + `CheckCircle2` icon + localized thank-you message (BHS/EN)
- Notification email to `contact@burabih.org`: out of scope here unless you want it. (Current waitlist forwarding goes through `waitlist.functions.ts`; happy to add an equivalent `partner_interest.functions.ts` — say the word.)

### Language toggle behavior
- BHS page links to `/en/partner`, EN page links to `/partner`
- Same toggle styling as existing pages
- Dropdown options for the "type" field localized per `lang`

### What I need from you before building content
- The copy for all 6 sections (BHS + EN)
- The list of "type" dropdown options (BHS labels + EN labels, and the stored value)
- Whether to also forward submissions to `contact@burabih.org` like waitlist does

### Order of execution
1. Run migration to create `partner_interest` table + RLS
2. Add `partner` i18n block (empty strings, ready to fill)
3. Create `PartnerPage.tsx` with section scaffolds + form wired to Supabase
4. Create `partner.tsx` and `en.partner.tsx` routes with head() metadata
5. Wire the BHS↔EN toggle as cross-route `<Link>`s
6. Once you send the content, drop it into the i18n block — no structural changes needed
