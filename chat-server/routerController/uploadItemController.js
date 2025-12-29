import { generatePutSignedUrl, generateDeleteSignedUrl } from "../service/s3.service.js";

export const getS3Url = async (req, res) => {
  try {
    const fileName = `${Date.now()}-${req.user._conditions._id}.jpg`;

    const { url } = await generatePutSignedUrl({ fileName, contentType: 'image/jpeg', expiresIn: 3600 });

    res.status(200).send({ url, fileName });
  } catch (err) {
    console.error("Error generating S3 signed URL:", err);
    res.status(500).send({ error: "S3 URL generation failed" });
  }
};

export const getDeleteSignedUrl = async (req, res) => {
  try {
    const fileName = req.body.fileName || req.query.fileName;
    if (!fileName) return res.status(400).send({ error: "fileName is required" });

    // Basic ownership check: ensure the filename contains user's id (filename pattern: timestamp-<userId>.ext)
    const userId = req.user && (req.user._conditions && req.user._conditions._id ? String(req.user._conditions._id) : String(req.user._id));
    if (!userId) return res.status(401).send({ error: "Unauthorized" });

    if (!fileName.includes(userId)) {
      return res.status(403).send({ error: "Forbidden: file does not belong to user" });
    }

    const { url, method } = await generateDeleteSignedUrl({ fileName, expiresIn: 3600 });

    // Client should perform an HTTP DELETE request to the returned URL
    res.status(200).send({ url, method });
  } catch (err) {
    console.error("Error generating delete S3 signed URL:", err);
    res.status(500).send({ error: "delete URL generation failed" });
  }
};
