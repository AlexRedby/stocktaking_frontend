import { serve } from "bun";
import index from "./index.html";

const backendTarget = "http://localhost:8080";

const server = serve({
  routes: {
    // Serve index.html for all unmatched routes.
    "/*": index,

    "/api/*": async (req) => {
      const url = new URL(req.url)
      const backendUrl = `${backendTarget}${url.pathname}${url.search}`
      
      return await fetch(backendUrl, {
        method: req.method,
        headers: req.headers,
        body: req.body,
      })
    }
  },

  development: process.env.NODE_ENV !== "production" && {
    // Enable browser hot reloading in development
    hmr: true,

    // Echo console logs from the browser to the server
    console: true,
  },
});

console.log(`🚀 Server running at ${server.url}`);
