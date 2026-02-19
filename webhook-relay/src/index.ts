interface Env {
  WEBHOOK_SECRET: string;
  GITHUB_TOKEN: string;
}

interface EASWebhookPayload {
  id: string;
  platform: string;
  status: string;
  artifacts?: {
    buildUrl?: string;
  };
  appVersion?: string;
  buildProfile?: string;
}

async function verifySignature(
  body: string,
  signature: string,
  secret: string
): Promise<boolean> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  const signed = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expectedSignature =
    "sha1=" +
    Array.from(new Uint8Array(signed))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

  return signature === expectedSignature;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Method not allowed", { status: 405 });
    }

    const signature = request.headers.get("expo-signature");
    if (!signature) {
      return new Response("Missing signature", { status: 401 });
    }

    const body = await request.text();

    const valid = await verifySignature(body, signature, env.WEBHOOK_SECRET);
    if (!valid) {
      return new Response("Invalid signature", { status: 401 });
    }

    const payload: EASWebhookPayload = JSON.parse(body);

    // Only forward completed Android builds
    if (payload.platform !== "ANDROID" || payload.status !== "finished") {
      return new Response("Ignored", { status: 200 });
    }

    const dispatchBody = JSON.stringify({
      event_type: "eas-build-complete",
      client_payload: {
        buildId: payload.id,
        platform: payload.platform,
        status: payload.status,
        buildUrl: payload.artifacts?.buildUrl ?? "",
        appVersion: payload.appVersion ?? "",
        buildProfile: payload.buildProfile ?? "",
      },
    });

    const ghResponse = await fetch(
      "https://api.github.com/repos/Bryan-Cee/blaze/dispatches",
      {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          "User-Agent": "eas-webhook-relay",
        },
        body: dispatchBody,
      }
    );

    if (!ghResponse.ok) {
      const errorText = await ghResponse.text();
      console.error(`GitHub API error: ${ghResponse.status} ${errorText}`);
      return new Response("GitHub API error", { status: 502 });
    }

    return new Response("Dispatched", { status: 200 });
  },
};
