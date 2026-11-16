-- 1. Share links: a user may only create or change a share for a letterhead they own.
--    Previously the policy checked the share row's user_id but not the letterhead's
--    owner, so a share could be pointed at someone else's letterhead.
DROP POLICY IF EXISTS "Users manage own shares" ON public.letterhead_shares;
CREATE POLICY "Users manage own shares" ON public.letterhead_shares
  FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (
    auth.uid() = user_id
    AND EXISTS (
      SELECT 1 FROM public.letterheads l
      WHERE l.id = letterhead_id AND l.user_id = auth.uid()
    )
  );

-- 2. Public share lookup: only resolve shares whose creator owns the letterhead
--    (which also neutralises any bad rows created under the old policy), and
--    return only the fields the public page needs instead of whole table rows.
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

  SELECT * INTO l FROM public.letterheads
    WHERE id = s.letterhead_id AND user_id = s.user_id;
  IF NOT FOUND THEN RETURN jsonb_build_object('error', 'not_found'); END IF;

  SELECT * INTO b FROM public.brands
    WHERE user_id = l.user_id
      AND (l.brand_id IS NULL OR id = l.brand_id)
    ORDER BY is_default DESC NULLS LAST
    LIMIT 1;

  UPDATE public.letterhead_shares SET view_count = view_count + 1 WHERE id = s.id;

  RETURN jsonb_build_object(
    'letter', jsonb_build_object(
      'title', l.title,
      'template', l.template,
      'font_family', l.font_family,
      'font_size', l.font_size,
      'primary_color', l.primary_color,
      'accent_color', l.accent_color,
      'letter_date', l.letter_date,
      'recipient', l.recipient,
      'subject', l.subject,
      'body', l.body,
      'signature_name', l.signature_name,
      'signature_title', l.signature_title,
      'signature_data', l.signature_data,
      'page_format', l.page_format,
      'page_orientation', l.page_orientation,
      'margin_mm', l.margin_mm,
      'show_qr', l.show_qr
    ),
    'brand', CASE WHEN b.id IS NULL THEN NULL ELSE jsonb_build_object(
      'company_name', b.company_name,
      'phone', b.phone,
      'email', b.email,
      'website', b.website,
      'address', b.address,
      'logo_path', b.logo_path,
      'primary_color', b.primary_color,
      'accent_color', b.accent_color,
      'watermark_text', b.watermark_text
    ) END,
    'allow_download', s.allow_download
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_shared_letterhead(text) TO anon, authenticated;

-- 3. Logos: stop anyone from listing every uploaded logo.
--    The bucket stays public, so a logo is still served to someone who has its
--    exact URL (needed for shared letters), but the blanket SELECT policy that
--    let any visitor enumerate the bucket is removed. Owners keep access to
--    their own folder through the existing "Users read own logos" policy.
DROP POLICY IF EXISTS "Public can view logos" ON storage.objects;
