import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";
import { env } from "@/config/env";

const handler = createMcpHandler(
  async (server) => {
    console.log('MCP server handler initialized');
    
    server.tool(
      "echo",
      "description",
      {
        message: z.string(),
      },
      async ({ message }) => {
        console.log('Echo tool called with message:', message);
        return {
          content: [{ type: "text", text: `Tool echo: ${message}` }],
        };
      }
    );
    server.tool(
      "number_sum",
      "Adds two numbers",
      {
        a: z.number(),
        b: z.number(),
      },
      async ({ a, b }) => ({
        content: [{ type: "text", text: `Result: ${a + b}` }],
      })
    );
  },
  {
    capabilities: {
      tools: {
        echo: {
          description: "Echo a message",
        },
        number_sum:{
          description:"Adds two numbers",
        }
      },
    },
  },
  {
    redisUrl: env.REDIS_URL,
    basePath: "",
    verboseLogs: true,
    maxDuration: 60,
  }
);

export { handler as GET, handler as POST, handler as DELETE };
