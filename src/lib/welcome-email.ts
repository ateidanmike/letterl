import { invokeEdgeFunction } from "@/lib/edge-functions";

/**
 * Ask the server to send the welcome email. Call it right after a person
 * confirms their email. The server sends it at most once per account, and a
 * failure here must never get in the way of signing in, so errors are dropped.
 */
export function requestWelcomeEmail() {
  void invokeEdgeFunction("send-welcome-email", { body: {} }).catch(() => {});
}
