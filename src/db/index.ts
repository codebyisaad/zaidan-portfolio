import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgres://portfolio:password@localhost:5432/portfolio_db';

const pool = new pg.Pool({
  connectionString,
});

export const db = drizzle(pool, { schema });
export { Guestbook } from './schema';
