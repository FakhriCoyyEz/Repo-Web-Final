import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from './schema';

// Manually provided by user
const url = 'libsql://fakhrizabirsicteam-db-fakhricoyyez.aws-ap-northeast-1.turso.io';
const authToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njc3MDkzOTgsImlkIjoiNDFkMDZiZWQtY2E5NS00YjQwLWE4YjctY2FmNTRhNTdmOGJmIiwicmlkIjoiNjE2ZjhmMjAtMjVjMS00ODI5LWEzZWItODFmZTNmYWM4ZmY5In0.sPKtTzYTmfCB4lys5AS53dka8vp3vc92utU9CI2iO-Q5J8BAdkT2SquvaKh5Pr4-o0rzUcCkmxWjxVWl6eFXAA';

const client = createClient({
  url: url,
  authToken: authToken,
});

export const db = drizzle(client, { schema });
export type Database = typeof db;
