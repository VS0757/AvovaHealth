// app/frontend/app/api/auth/[kindeAuth]/route.ts
import { handleAuth } from "@kinde-oss/kinde-auth-nextjs/server";

// Export a handler for GET requests
export const GET = handleAuth();

// If you need to handle other HTTP methods, you can do so with additional exports
// Example:
// export const post = handleAuth();
