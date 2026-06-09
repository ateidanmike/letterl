import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { documentSlug } from "@/lib/documents/slug";
import { BusinessDocumentEditor } from "./document-editor";

export const Route = createFileRoute("/_authenticated/document/$slug")({
  component: SlugDocumentEditor,
  head: () => ({ meta: [{ title: "Document editor - Zuridoc" }] }),
});

type SlugRow = { id: string; title: string; doc_number: string };

function SlugDocumentEditor() {
  const { user } = useAuth();
  const { slug } = Route.useParams();
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    if (!user) return;
    setDocumentId(null);
    setMissing(false);

    (async () => {
      const { data, error } = await supabase
        .from("business_documents")
        .select("id,title,doc_number")
        .eq("user_id", user.id);

      if (error) {
        toast.error(error.message);
        setMissing(true);
        return;
      }

      const match = ((data as SlugRow[] | null) ?? []).find((doc) => documentSlug(doc) === slug);
      if (match) setDocumentId(match.id);
      else setMissing(true);
    })();
  }, [slug, user]);

  if (missing) return <Navigate to="/documents" />;
  if (!documentId) return <div className="p-10 text-muted-foreground">Loading...</div>;

  return <BusinessDocumentEditor documentId={documentId} />;
}