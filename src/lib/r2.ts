import { S3Client } from "@aws-sdk/client-s3";

const globalForR2 = globalThis as unknown as { r2?: S3Client };

function createClient() {
  const accountId = requireEnv("R2_ACCOUNT_ID");
  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: requireEnv("R2_ACCESS_KEY_ID"),
      secretAccessKey: requireEnv("R2_SECRET_ACCESS_KEY"),
    },
  });
}

export function getR2(): S3Client {
  const client = globalForR2.r2 ?? createClient();
  if (process.env.NODE_ENV !== "production") globalForR2.r2 = client;
  return client;
}

export function getR2Bucket(): string {
  return requireEnv("R2_BUCKET_NAME");
}

/** Public URL for an object key, using the bucket's r2.dev (or custom) domain. */
export function r2PublicUrl(key: string): string {
  const base = requireEnv("R2_PUBLIC_URL").replace(/\/$/, "");
  return `${base}/${key}`;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Falta la variable de entorno ${name}`);
  return value;
}
