import { db } from "@/db/db";
import { openai } from "@ai-sdk/openai";
import {
  streamText,
  UIMessage,
  convertToModelMessages,
  tool,
  stepCountIs,
} from "ai";
import { z } from "zod";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const modelMessages = await convertToModelMessages(messages);

  const SYSTEM_PROMPT = `You are an expert SQL assistant that helps users to query their database using natural language.

    Current Time: ${new Date().toLocaleString("sv-SE")}

    TOOLS USAGE:
    1. Always call the 'schema' tool first if you are unsure of the table structure.
    2. Call the 'db' tool to execute queries.

    RESPONSE RULES:
    - ONLY generate SELECT queries (no INSERT, UPDATE, DELETE, DROP)
    - IMPORTANT: When the 'db' tool returns data, do NOT re-type the data or create Markdown tables in your text response.
    - The UI will automatically display the table from the tool output.
    - Your text response should only be a brief, conversational summary (e.g., "I've found 10 products in the category...") or an answer to a specific question based on that data.
    - If no data is found, inform the user politely.
    - Always use the schema provided by the schema tool
    - Pass in valid SQL syntax in db tool.
    - IMPORTANT: To query database call db tool, Don't return just SQL query.

    Always respond in a helpful, conversational tone while being technically accurate.`;

  const result = streamText({
    model: openai("gpt-5-nano-2025-08-07"),
    messages: modelMessages,
    system: SYSTEM_PROMPT,
    stopWhen: stepCountIs(5),
    tools: {
      schema: tool({
        description: "Call this tool to get database schema information ",
        inputSchema: z.object({}),
        execute: async () => {
          return `CREATE TABLE analytics (
                    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                    date text NOT NULL,
                    total_sales real DEFAULT 0,
                    total_orders integer DEFAULT 0,
                    total_customers integer DEFAULT 0
                  );

                  CREATE TABLE customers (
                    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                    name text NOT NULL,
                    email text NOT NULL,
                    phone text,
                    address text,
                    created_at text DEFAULT CURRENT_TIMESTAMP
                  );

                  CREATE UNIQUE INDEX customers_email_unique ON customers (email);


                  CREATE TABLE inventory_logs (
                    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                    product_id integer NOT NULL,
                    change integer NOT NULL,
                    type text NOT NULL,
                    created_at text DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE no action ON DELETE no action
                  );

                  CREATE TABLE order_items (
                    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                    order_id integer NOT NULL,
                    product_id integer NOT NULL,
                    quantity integer NOT NULL,
                    price real NOT NULL,
                    FOREIGN KEY (order_id) REFERENCES orders(id) ON UPDATE no action ON DELETE no action,
                    FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE no action ON DELETE no action
                  );

                  CREATE TABLE orders (
                    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                    customer_id integer NOT NULL,
                    total_amount real NOT NULL,
                    status text DEFAULT 'pending',
                    created_at text DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (customer_id) REFERENCES customers(id) ON UPDATE no action ON DELETE no action
                  );

                  CREATE TABLE products (
                    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                    name text NOT NULL,
                    category text NOT NULL,
                    price real NOT NULL,
                    stock integer DEFAULT 0 NOT NULL,
                    created_at text DEFAULT CURRENT_TIMESTAMP
                  );

                  CREATE TABLE sales (
                    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                    product_id integer NOT NULL,
                    quantity integer NOT NULL,
                    total_amount real NOT NULL,
                    sale_date text DEFAULT CURRENT_TIMESTAMP,
                    customer_name text NOT NULL,
                    region text NOT NULL,
                    FOREIGN KEY (product_id) REFERENCES products(id) ON UPDATE no action ON DELETE no action
                  );

                  CREATE TABLE suppliers (
                    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                    name text NOT NULL,
                    contact_email text,
                    phone text,
                    address text
                  );

                  CREATE TABLE users (
                    id integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                    name text NOT NULL,
                    email text NOT NULL,
                    role text DEFAULT 'admin',
                    created_at text DEFAULT CURRENT_TIMESTAMP
                  );

                  CREATE UNIQUE INDEX users_email_unique ON users (email);`;
        },
      }),
      db: tool({
        description: "Call this tool to query a database",
        inputSchema: z.object({
          query: z.string().describe("The SQL query to be run"),
        }),
        execute: async ({ query }) => {
          console.log("Query: ", query);
          // Importtant: make sure you sanitize / validate (somehow) check the query
          // string search [delete , update] --> Guardrails
          return await db.run(query);
        },
      }),
    },
  });
  return result.toUIMessageStreamResponse();
}
