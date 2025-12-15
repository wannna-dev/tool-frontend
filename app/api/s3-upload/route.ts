import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY!,
  },
});

// Supported image types
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/svg+xml',
  'image/bmp',
  'image/tiff',
];

async function uploadFileToS3(buffer: Buffer, fileName: string, contentType: string, folder: string) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME!,
    Key: `${folder}/${Date.now()}-${fileName}`,
    Body: buffer,
    ContentType: contentType, // Use the actual file type
    // Remove ACL if your bucket has "Block all public access" enabled
    // ACL: "public-read" as ObjectCannedACL,
  };

  await s3Client.send(new PutObjectCommand(params));

  return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_S3_REGION}.amazonaws.com/${params.Key}`;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const folder = (formData.get("folder") as string) || "";

    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 400 });
    }

    // Validate file is an image
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      return NextResponse.json({ 
        error: "Invalid file type. Only images are allowed.",
        allowedTypes: ALLOWED_IMAGE_TYPES 
      }, { status: 400 });
    }

    // Optional: Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: "File too large. Maximum size is 5MB." 
      }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadFileToS3(buffer, file.name, file.type, folder);

    return NextResponse.json({ success: true, url });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ 
      error: "Error uploading file",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}