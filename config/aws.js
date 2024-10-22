const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  endpoint: 'https://<your-cloudflare-account-id>.r2.cloudflarestorage.com',
  accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
  secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  region: 'auto', // This is required for compatibility
  signatureVersion: 'v4', // Use AWS Signature Version 4
});
