import { S3Client } from '@aws-sdk/client-s3'
import { ApiError } from '../error/ApiError';


function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) throw new ApiError(500, `Missing environment variable: ${name}`);
  return value;
}

function getS3Client() {
  const s3Client = new S3Client({
    region: getEnvVar('S3_BUCKET_REGION'),
    credentials: {
      accessKeyId: getEnvVar('AWS_ACCESS_KEY'),
      secretAccessKey: getEnvVar('AWS_SECRET_KEY')
    }
  })
  return s3Client
}

const s3Client = getS3Client();

export default s3Client 
