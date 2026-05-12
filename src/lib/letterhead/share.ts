import { supabase } from "@/integrations/supabase/client";

function randomToken(len = 24) {
  const bytes = new Uint8Array(len);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, len);
}

export type CreateShareOptions = {
  letterheadId: string;
  userId: string;
  expiresAt?: string | null;
  allowDownload: boolean;
};

export async function createShareLink(opts: CreateShareOptions) {
  const token = randomToken(20);
  const { error } = await supabase.from("letterhead_shares").insert({
    token,
    letterhead_id: opts.letterheadId,
    user_id: opts.userId,
    expires_at: opts.expiresAt ?? null,
    allow_download: opts.allowDownload,
  });
  if (error) throw error;
  return shareUrl(token);
}

export function shareUrl(token: string) {
  return `${window.location.origin}/share/${token}`;
}