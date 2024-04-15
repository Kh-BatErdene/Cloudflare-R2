import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";

const R2 = new S3Client({
  region: "auto",
  endpoint: `https://693b861e974f74c04e3709ef18e3e982.r2.cloudflarestorage.com/baterdene`,
  credentials: {
    accessKeyId: "9bcf5b21c7c6b0ac595dae3c0935cf2e" || "",
    secretAccessKey:
      "e7b6965ec2af532de2140e31a57b5e6a5b62d384ba917e32f4b140caa1c04a15" || "",
  },
});

export default async function cloudflareHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await getUrl(res);
  }
}

const getUrl = async (res: NextApiResponse) => {
  try {
    const key = v4();
    const urls = await getSignedUrl(
      R2,
      new PutObjectCommand({
        Bucket: "baterdene",
        Key: key,
        ACL: "public-read",
      }),
      { expiresIn: 3600 }
    );
    const url = "https://pub-866fe00d671d424791c315f38a34d7c8.r2.dev/";
    return res.status(200).json({ signedUrl: urls, accessUrl: url });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
