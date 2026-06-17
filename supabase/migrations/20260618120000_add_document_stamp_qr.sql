ALTER TABLE public.business_documents
  ADD COLUMN IF NOT EXISTS show_qr boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS qr_text text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS show_company_stamp boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS company_stamp_data text NULL;
