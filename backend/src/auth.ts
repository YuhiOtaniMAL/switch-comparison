let cachedAccessToken: string | null = null;

export async function getAccessToken(): Promise<string> {
  if (cachedAccessToken) {
    return cachedAccessToken;
  }

  const response = await fetch("https://api.intra.42.fr/oauth/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: process.env.FT_CLIENT_UID,
      client_secret: process.env.FT_CLIENT_SECRET,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Failed to obtain 42 API access token (${response.status})`);
  }

  const data = (await response.json()) as { access_token: string };
  cachedAccessToken = data.access_token;
  return cachedAccessToken;
}
