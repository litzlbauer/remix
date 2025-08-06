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
    { success: true, count: news.filter(article => !article.isRead).length, request: request.signal },
    { headers: { "Access-Control-Allow-Origin": "*" }}
  );
};
