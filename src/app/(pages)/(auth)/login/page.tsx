// app/login/page.tsx
import { Suspense } from "react";
import { ClientLoginWrapper } from "./form";

const DEFAULT_REDIRECT_PATH = "/profile";

async function getRedirectPath(searchParams: Promise<{ continue?: string }>) {
  try {
    const params = await searchParams;
    const continueParam = params.continue;

    // Validate the redirect path
    if (typeof continueParam !== "string" || !continueParam) {
      return DEFAULT_REDIRECT_PATH;
    }

    // Basic security checks - prevent open redirect vulnerabilities
    if (!isRelativeUrl(continueParam)) {
      console.warn(`Invalid redirect path: ${continueParam}`);
      return DEFAULT_REDIRECT_PATH;
    }

    // Additional validation if needed (e.g., check against allowed paths)
    // You might want to implement a list of allowed paths
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

// Example helper functions (implement these in a separate file)
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

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ continue?: string }>;
}) {
  let redirectPath = DEFAULT_REDIRECT_PATH;

  try {
    redirectPath = await getRedirectPath(searchParams);
  } catch (error) {
    console.error("Error determining redirect path:", error);
    // Fall back to default path in case of error
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ClientLoginWrapper redirectPath={redirectPath} />
    </Suspense>
  );
}
