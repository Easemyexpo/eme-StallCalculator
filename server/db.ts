import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

// Handle missing DATABASE_URL gracefully for serverless
let pool: Pool;
let db: ReturnType<typeof drizzle>;

try {
  if (!process.env.DATABASE_URL) {
    console.warn("DATABASE_URL not set. Database operations will be disabled.");
    // Create a mock pool for development
    pool = new Pool({ connectionString: "postgresql://mock:mock@localhost:5432/mock" });
  } else {
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
  }
  db = drizzle({ client: pool, schema });
} catch (error) {
  console.error("Database connection error:", error);
  // Create a mock pool as fallback
  pool = new Pool({ connectionString: "postgresql://mock:mock@localhost:5432/mock" });
  db = drizzle({ client: pool, schema });
}

export { pool, db };