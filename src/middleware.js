import { NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAdminPage = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAdminApi =
    (pathname.startsWith("/api/hotels") ||
      pathname.startsWith("/api/conteudo") ||
      pathname.startsWith("/api/extrair") ||
      pathname.startsWith("/api/banners")) &&
    ["POST", "PUT", "DELETE"].includes(request.method);
  const isUploadApi = pathname.startsWith("/api/upload");
  const isSenhaApi = pathname.startsWith("/api/auth/senha");

  if (isAdminPage || isAdminApi || isUploadApi || isSenhaApi) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;
    const session = await verifySessionToken(token);

    if (!session) {
      if (isAdminPage) {
        const loginUrl = new URL("/admin/login", request.url);
        loginUrl.searchParams.set("redirect", pathname);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/hotels/:path*",
    "/api/conteudo/:path*",
    "/api/banners/:path*",
    "/api/upload/:path*",
    "/api/extrair/:path*",
    "/api/auth/senha/:path*",
  ],
};
