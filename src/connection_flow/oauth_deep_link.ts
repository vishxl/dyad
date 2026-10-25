import {
  CONNECTION_FLOW_INVOCATION_KIND,
  type ConnectionFlowInvocationRef,
} from "./state";
import { oauthBaseUrl, supabaseOauthBaseUrl } from "../external_endpoints";

export type DeepLinkOAuthProvider = "neon" | "supabase";

const loginUrls = (): Record<DeepLinkOAuthProvider, string> => ({
  neon: `${oauthBaseUrl()}/api/integrations/neon/login`,
  supabase: `${supabaseOauthBaseUrl()}/api/connect-supabase/login`,
});

const OAUTH_STATE_PATTERN = /^[A-Za-z0-9:._~-]{1,200}$/;

export function buildOAuthLoginUrl(
  provider: DeepLinkOAuthProvider,
  invocationRef: ConnectionFlowInvocationRef,
): string {
  if (
    invocationRef.kind !== CONNECTION_FLOW_INVOCATION_KIND ||
    invocationRef.entityKey !== provider
  ) {
    throw new Error(`OAuth invocation does not belong to ${provider}`);
  }

  const url = new URL(loginUrls()[provider]);
  url.searchParams.set("state", invocationRef.operationId);
  return url.toString();
}

export function parseOAuthCallbackInvocationRef(
  provider: DeepLinkOAuthProvider,
  state: string | null,
): ConnectionFlowInvocationRef | null {
  if (!state || !OAUTH_STATE_PATTERN.test(state)) {
    return null;
  }

  return {
    kind: CONNECTION_FLOW_INVOCATION_KIND,
    entityKey: provider,
    operationId: state,
  };
}
