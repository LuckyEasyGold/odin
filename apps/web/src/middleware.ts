export { auth as middleware } from "@/lib/auth";

// Protect these routes: only logged in users can access /dashboard
export const config = {
  matcher: ["/dashboard/:path*"],
};
