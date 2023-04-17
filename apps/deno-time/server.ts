import { serve } from "https://deno.land/std@0.178.0/http/server.ts";
const port = 8080;

function handler(/* req: Request */): Response {
  return new Response(JSON.stringify({ time: new Date() ,lang:"Deno/TypeScript"}));
}

serve(handler, { port });
