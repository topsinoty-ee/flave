// app/login/page.tsx
import { Suspense } from "react";
import { ClientLoginWrapper } from "./form";

const DEFAULT_REDIRECT_PATH = "/profile";

// Example helper functions (implement these in a separate file if needed)
function isRelativeUrl(url: string): boolean {
  try {
    // Simple check - should start with / and not with // or http(s)://
    return (
      url.startsWith("/") &&
      !url.startsWith("//") &&
      !url.match(/^https?:\/\//i)
    );
  } catch {
    return false;
  }
}

function isValidRedirectPath(path: string): boolean {
  // Add any additional path validation logic here
  // For example, you might want to prevent redirects to auth pages
  const forbiddenPaths = ["/login", "/logout", "/api"];
  return !forbiddenPaths.some((forbidden) => path.startsWith(forbidden));
}

function getRedirectPath(continueParam: string | undefined): string {
  try {
    // Validate the redirect path
    if (typeof continueParam !== "string" || !continueParam) {
      return DEFAULT_REDIRECT_PATH;
    }

    // Basic security checks - prevent open redirect vulnerabilities
    if (!isRelativeUrl(continueParam)) {
      console.warn(`Invalid redirect path: ${continueParam}`);
      return DEFAULT_REDIRECT_PATH;
    }

    // Additional validation if needed
    if (!isValidRedirectPath(continueParam)) {
      console.warn(`Invalid redirect path: ${continueParam}`);
      return DEFAULT_REDIRECT_PATH;
    }

    return continueParam;
  } catch (error) {
    console.error("Error processing redirect path:", error);
    return DEFAULT_REDIRECT_PATH;
  }
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ continue?: string }>;
}) {
  const { continue: continueParam } = await searchParams;
  // Process searchParams directly without awaiting
  const redirectPath = getRedirectPath(continueParam || "");

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientLoginWrapper redirectPath={redirectPath} />
    </Suspense>
  );
}
