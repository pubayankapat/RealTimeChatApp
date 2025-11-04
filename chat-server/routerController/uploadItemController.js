import { s3 } from "../utils/aws.js";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const getS3Url = async (req, res) => {
  try {
    const fileName = `${Date.now()}-${req.user._conditions._id}.jpg`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: fileName,
      ContentType: "image/jpeg",
    });

    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    res.status(200).send({ url, fileName });
  } catch (err) {
    console.error("Error generating S3 signed URL:", err);
    res.status(500).send({ error: "S3 URL generation failed" });
  }
};
