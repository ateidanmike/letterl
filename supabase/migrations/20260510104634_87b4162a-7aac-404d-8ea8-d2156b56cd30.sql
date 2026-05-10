-- Multi-brand profiles: add name + default flag, drop implicit single-brand assumption
ALTER TABLE public.brands ADD COLUMN IF NOT EXISTS name text NOT NULL DEFAULT 'My brand';
ALTER TABLE public.brands ADD COLUMN IF NOT EXISTS is_default boolean NOT NULL DEFAULT false;
ALTER TABLE public.brands ADD COLUMN IF NOT EXISTS watermark_text text;

-- Letterheads: folders, signature, language, brand link
ALTER TABLE public.letterheads ADD COLUMN IF NOT EXISTS folder text NOT NULL DEFAULT 'Inbox';
ALTER TABLE public.letterheads ADD COLUMN IF NOT EXISTS signature_data text;
ALTER TABLE public.letterheads ADD COLUMN IF NOT EXISTS brand_id uuid REFERENCES public.brands(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_letterheads_user_folder ON public.letterheads(user_id, folder);
CREATE INDEX IF NOT EXISTS idx_brands_user ON public.brands(user_id);

-- Updated_at triggers (idempotent)
DROP TRIGGER IF EXISTS brands_updated_at ON public.brands;
CREATE TRIGGER brands_updated_at BEFORE UPDATE ON public.brands
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS letterheads_updated_at ON public.letterheads;
CREATE TRIGGER letterheads_updated_at BEFORE UPDATE ON public.letterheads
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();