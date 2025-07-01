import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/schema.ts',
  out: './supabase/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.VITE_SUPABASE_URL + '/rest/v1/' || '',
  },
} satisfies Config;