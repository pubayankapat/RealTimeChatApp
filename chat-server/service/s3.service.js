import { s3 } from "../utils/aws.js";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const generatePutSignedUrl = async ({ fileName, contentType = "application/octet-stream", expiresIn = 3600 } = {}) => {
  if (!fileName) throw new Error('fileName is required');
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    ContentType: contentType,
  });
  const url = await getSignedUrl(s3, command, { expiresIn });
  return { url, method: 'PUT' };
};

export const generateDeleteSignedUrl = async ({ fileName, expiresIn = 3600 } = {}) => {
  if (!fileName) throw new Error('fileName is required');
  const command = new DeleteObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
  });
  const url = await getSignedUrl(s3, command, { expiresIn });
  return { url, method: 'DELETE' };
};

export default { generatePutSignedUrl, generateDeleteSignedUrl };