import type { LoaderFunctionArgs } from "@remix-run/node"; // or cloudflare/deno
import { json } from "@remix-run/node"; // or cloudflare/deno
import { getNews } from "~/data";
import { getCorsHeaders, handleOptionsRequest } from "~/utils/cors";

export const loader = async ({
  request,
}: LoaderFunctionArgs) => {
  // handle "GET" request
  const news = await getNews();
  return json(
    { success: true, news }, 
    { status: 200, headers: getCorsHeaders() }
  );
};

// Handle preflight OPTIONS requests
export const action = async ({ request }: LoaderFunctionArgs) => {
  if (request.method === "OPTIONS") {
    return handleOptionsRequest();
  }
  
  return json({ error: "Method not allowed" }, { status: 405, headers: getCorsHeaders() });
};