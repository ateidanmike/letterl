
# Letterhead Generator — Plan

A web tool where logged-in users upload their logo + brand details, type/paste body content, optionally clean it with AI (grammar + spelling), pick a preset template, and download a professional letterhead as PDF or DOCX. Saved letterheads and logos persist per user.

## Stack additions
- Enable **Lovable Cloud** (auth, database, storage, edge function for AI).
- Email/password + Google login.
- Storage bucket `logos` (private, per-user RLS).
- Edge function `clean-text` calling Lovable AI Gateway (`google/gemini-3-flash-preview`) for grammar/spelling correction.

## Pages / routes
```
/                      Landing — pitch + CTA to login
/login                 Email + Google sign-in (also signup)
/_authenticated/
  dashboard            List of saved letterheads + "New letterhead"
  editor               Editor (create or ?id= edit)
  brand                Manage logo + company details (phone, email, website, address, accent colors)
```

## Editor UI (single page, two columns)
Left = controls, Right = live A4 preview.

Controls panel:
1. **Brand block** — logo upload (drag/drop, replaces stored logo), company name, phone, email, website, address.
2. **Template picker** — 4 presets:
   - *Classic Centered* (mirrors the Nopal Tech reference: centered logo, blue/green divider, blue/green chevron footer with phone/email/website).
   - *Left-Aligned Modern* (logo left, contact info right).
   - *Minimal* (small logo top-left, single thin rule, footer line of contact text).
   - *Bold Banner* (full-width colored header band with logo + company name).
3. **Typography** — font family (Inter, Roboto, Lora, Merriweather, Montserrat, Playfair, Georgia, Arial), font size slider (10–14pt), line height.
4. **Colors** — primary + accent color pickers (default to template defaults; Classic Centered defaults to Nopal blue `#1E40AF` / green `#16A34A` / orange `#F59E0B`).
5. **Body content** — date, recipient block, subject, rich body textarea, signature name/title.
6. **AI Clean Text** button — sends body to `clean-text` edge function; returns corrected text with a diff toggle (Accept / Revert).
7. **Save** (upserts to `letterheads` table) and **Export → PDF / DOCX**.

Preview right side: real A4 page rendered with chosen template, colors, font, logo, and body — updates live.

## Export
- **PDF**: client-side via `jsPDF` + `html2canvas` of the preview node (pixel-perfect to what user sees). A4, 1in margins.
- **DOCX**: client-side via `docx` npm package — rebuild the layout (header with logo image, body paragraphs with chosen font/size, footer table with contact items + colored shapes). Templates map to docx generators per preset.

## Database (migrations)
```sql
profiles(id uuid pk → auth.users, full_name, created_at)
brands(
  id uuid pk, user_id uuid → auth.users, company_name, phone, email,
  website, address, logo_path text, primary_color, accent_color,
  created_at, updated_at
)  -- one row per user (unique user_id)
letterheads(
  id uuid pk, user_id uuid, title, template text,
  font_family, font_size int, primary_color, accent_color,
  date date, recipient text, subject text, body text,
  signature_name, signature_title, updated_at
)
```
RLS: `user_id = auth.uid()` on select/insert/update/delete for `brands` and `letterheads`. `profiles` auto-created via trigger on `auth.users` insert. Storage bucket `logos` with policy `bucket_id='logos' AND auth.uid()::text = (storage.foldername(name))[1]`.

## Edge function `clean-text`
- Input: `{ text: string }`.
- System prompt: "Fix only grammar, spelling, and punctuation. Preserve tone, meaning, paragraph structure, and formatting. Return only the corrected text."
- Returns `{ cleaned: string }`. Surfaces 402/429 errors to client as toasts.

## Out of scope (this iteration)
- Multi-page letters, image embedding inside body, team sharing, custom template builder.

## Technical notes
- Logo stored at `logos/{userId}/logo.{ext}`; preview reads via signed URL.
- All editor server reads via `createServerFn` with `requireSupabaseAuth`; loaders gated by `_authenticated/` layout that redirects to `/login`.
- `jsPDF` and `docx` are pure JS — Worker-safe but only used client-side anyway.
- DOCX templates defined in `src/lib/letterhead/docx-templates.ts`; preview templates as React components in `src/components/letterhead/templates/`.
