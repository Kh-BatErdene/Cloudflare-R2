import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 } from "uuid";

const R2 = new S3Client({
  region: "auto",
  endpoint: process.env.ENDPOINT || "",
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID || "",
    secretAccessKey: process.env.SECRET_ACCESS_KEY || "",
  },
});

export default async function fileManagement(
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
        Bucket: "test",
        Key: key,
        ACL: "public-read",
      }),
      { expiresIn: 3600 }
    );

    return res
      .status(200)
      .json({ signedUrl: urls, accessUrl: process.env.PUB_URL + key });
  } catch (error) {
    return res.status(500).json({ error });
  }
};
