import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import * as schema from './schema';

// Create the connection
const connection = connect({
  url: import.meta.env.VITE_DATABASE_URL || process.env.DATABASE_URL
});

// Create the database instance
export const db = drizzle(connection, { schema });

export type Database = typeof db;