import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Create the connection
const connectionString = import.meta.env.VITE_SUPABASE_URL 
  ? `postgresql://postgres:[YOUR-PASSWORD]@${import.meta.env.VITE_SUPABASE_URL.replace('https://', '').replace('.supabase.co', '')}.supabase.co:5432/postgres`
  : '';

const client = postgres(connectionString);

// Create the database instance
export const db = drizzle(client, { schema });

export type Database = typeof db;