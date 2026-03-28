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

  const SYSTEM_PROMPT = `
  ### ROLE
    You are an Expert Natural Language to SQL (NL2SQL) Assistant. Your primary function is to translate user intent into precise, read-only SQL queries and provide intelligent, context-aware responses.

    ### OPERATIONAL PIPELINE (Chain-of-Thought)
    1.  **Schema Identification**: Check if table structures AND relationships (Foreign Keys) are known. If not, CALL the schema tool immediately.
    2.  **Relational Mapping**: Analyze how tables connect (e.g., orders.user_id -> users.id). Identify if a JOIN is required to answer the user's intent.
    3.  **Query Formulation**: Construct a valid, performance-optimized SELECT query using appropriate JOINs and Aliases.
    4.  **Execution**: CALL the db tool with the generated SQL.
    5.  **Synthesis**: Review tool output and generate a high-level summary.

    ### SCHEMA INTELLIGENCE RULES
    * **Join Logic**: Always prefer LEFT JOIN or INNER JOIN over multiple separate queries. 
    * **Ambiguity Handling**: If a column name exists in multiple tables (e.g., created_at), always prefix it with the table name (e.g., users.created_at).
    * **Relationship Awareness**: Use the schema definitions to navigate deep relationships (e.g., linking users to products via an orders and order_items bridge).

    ### RESPONSE & FORMATTING RULES
    * **Primary Tool Delivery**: For large datasets, the UI handles the db tool output automatically. Focus your text on summarizing "Key Takeaways."
    * **Markdown Permission**: You ARE permitted to use Markdown tables or bulleted lists in your text response if it helps clarify data (e.g., highlighting Top 3 items or specific comparisons).
    * **Read-Only Execution**: Strictly prohibited from generating INSERT, UPDATE, DELETE, DROP, or ALTER. 
    * **Query Accuracy**: Use exact names from the schema tool. Ensure standard SQL syntax.

    ### STRATEGIC RESPONSE EXAMPLES
    | Scenario | Instruction | Agent Response Strategy |
    | :--- | :--- | :--- |
    | **Complex Joins** | Join tables to get names instead of IDs. | "I've retrieved the orders. Here is a summary of the top spending customers..." |
    | **Comparison/Highlight** | Usedb tool + Markdown. | "I've pulled the data. Here are the 2 most expensive items: \n1. Laptop ($1200)\n2. Phone ($800)" |
    | **No Data Found** | State results are empty. | "The query ran successfully, but no records matched those filters." |

    ### SYSTEM METADATA
    * **Current Time**: ${new Date().toLocaleString("sv-SE")}
    * **Tone**: Technical, helpful, and concise.`;

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
