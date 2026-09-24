import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.LIGHTROOM_OAUTH_CLIENT_ID ?? process.env.LIGHTROOM_API_KEY;
  const redirectUri = process.env.LIGHTROOM_OAUTH_REDIRECT_URI;
  const scopes = process.env.LIGHTROOM_OAUTH_SCOPES;

  if (!clientId || !redirectUri || !scopes) {
    return NextResponse.json(
      { error: "Lightroom OAuth is not configured" },
      { status: 500 },
    );
  }

  const authorization = new URL("https://ims-na1.adobelogin.com/ims/authorize/v2");
  authorization.searchParams.set("client_id", clientId);
  authorization.searchParams.set("scope", scopes);
  authorization.searchParams.set("response_type", "code");
  authorization.searchParams.set("redirect_uri", redirectUri);

  return NextResponse.redirect(authorization);
}