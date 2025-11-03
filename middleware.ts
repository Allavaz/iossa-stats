import { auth } from "@/auth";
import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  await auth();

  // Create response
  const response = NextResponse.next();

  // Check that response is valid before modifying headers
  if (response instanceof NextResponse) {
    const pathname = request.nextUrl.pathname;

    // Add custom cache headers for images
    if (
      pathname.startsWith("/images/") ||
      pathname.endsWith(".png") ||
      pathname.endsWith(".jpg") ||
      pathname.endsWith(".webp") ||
      pathname.endsWith(".svg") ||
      pathname.endsWith(".ttf")
    ) {
      response.headers.set(
        "Cache-Control",
        "public, max-age=31536000, immutable"
      );
    }
  }

  return response;
}
