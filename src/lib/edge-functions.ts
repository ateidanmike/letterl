import { supabase } from "@/integrations/supabase/client";

type EdgeInvokeOptions = {
  body: Record<string, unknown>;
};

export async function invokeEdgeFunction<T>(functionName: string, { body }: EdgeInvokeOptions) {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session?.access_token) {
    throw new Error("Please sign in again before using AI features.");
  }

  const { data, error, response } = await supabase.functions.invoke<T>(functionName, {
    body,
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (error) {
    throw new Error((await edgeErrorMessage(response)) ?? error.message);
  }

  return data;
}

async function edgeErrorMessage(response?: Response) {
  if (!response) return null;

  try {
    const contentType = response.headers.get("content-type") ?? "";
    if (contentType.includes("application/json")) {
      const body = (await response.clone().json()) as { error?: string; message?: string };
      return body.error ?? body.message ?? null;
    }

    const text = await response.clone().text();
    return text || null;
  } catch {
    return null;
  }
}
