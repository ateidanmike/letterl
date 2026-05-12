-- Page setup + QR on letterheads
ALTER TABLE public.letterheads
  ADD COLUMN IF NOT EXISTS page_format text NOT NULL DEFAULT 'a4',
  ADD COLUMN IF NOT EXISTS page_orientation text NOT NULL DEFAULT 'portrait',
  ADD COLUMN IF NOT EXISTS margin_mm integer NOT NULL DEFAULT 18,
  ADD COLUMN IF NOT EXISTS show_qr boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS brand_id uuid;

-- Personal saved templates
CREATE TABLE IF NOT EXISTS public.user_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  name text NOT NULL,
  snapshot jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.user_templates ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own templates" ON public.user_templates;
CREATE POLICY "Users manage own templates" ON public.user_templates
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Share links
CREATE TABLE IF NOT EXISTS public.letterhead_shares (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  letterhead_id uuid NOT NULL REFERENCES public.letterheads(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  expires_at timestamptz,
  allow_download boolean NOT NULL DEFAULT true,
  view_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.letterhead_shares ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own shares" ON public.letterhead_shares;
CREATE POLICY "Users manage own shares" ON public.letterhead_shares
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Public read function for shared letterheads (no auth required, token is the secret)
CREATE OR REPLACE FUNCTION public.get_shared_letterhead(_token text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  s record;
  l record;
  b record;
BEGIN
  SELECT * INTO s FROM public.letterhead_shares WHERE token = _token;
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'not_found'); END IF;
  IF s.expires_at IS NOT NULL AND s.expires_at < now() THEN
    RETURN jsonb_build_object('error', 'expired');
  END IF;
  SELECT * INTO l FROM public.letterheads WHERE id = s.letterhead_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'not_found'); END IF;
  SELECT * INTO b FROM public.brands
    WHERE (l.brand_id IS NOT NULL AND id = l.brand_id)
       OR (l.brand_id IS NULL AND user_id = l.user_id)
    ORDER BY is_default DESC NULLS LAST
    LIMIT 1;
  UPDATE public.letterhead_shares SET view_count = view_count + 1 WHERE id = s.id;
  RETURN jsonb_build_object(
    'letter', to_jsonb(l),
    'brand', to_jsonb(b),
    'allow_download', s.allow_download
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_shared_letterhead(text) TO anon, authenticated;

-- Make logos bucket public so shared letters display the logo
UPDATE storage.buckets SET public = true WHERE id = 'logos';

-- Public read of logo objects
DROP POLICY IF EXISTS "Public can view logos" ON storage.objects;
CREATE POLICY "Public can view logos" ON storage.objects
  FOR SELECT USING (bucket_id = 'logos');