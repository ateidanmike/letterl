
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TABLE public.business_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  doc_type TEXT NOT NULL DEFAULT 'invoice',
  doc_number TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Untitled document',
  template TEXT NOT NULL DEFAULT 'modern',
  brand_id UUID NULL,
  issue_date DATE NULL DEFAULT CURRENT_DATE,
  due_date DATE NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  from_party JSONB NOT NULL DEFAULT '{}'::jsonb,
  to_party JSONB NOT NULL DEFAULT '{}'::jsonb,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  tax_rate NUMERIC NOT NULL DEFAULT 0,
  discount NUMERIC NOT NULL DEFAULT 0,
  notes TEXT NOT NULL DEFAULT '',
  terms TEXT NOT NULL DEFAULT '',
  primary_color TEXT NOT NULL DEFAULT '#2563EB',
  accent_color TEXT NOT NULL DEFAULT '#0EA5E9',
  signature_name TEXT NOT NULL DEFAULT '',
  signature_title TEXT NOT NULL DEFAULT '',
  signature_data TEXT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.business_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own documents" ON public.business_documents
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own documents" ON public.business_documents
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own documents" ON public.business_documents
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own documents" ON public.business_documents
  FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER trg_business_documents_updated
  BEFORE UPDATE ON public.business_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_business_documents_user ON public.business_documents(user_id, updated_at DESC);
