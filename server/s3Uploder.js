import dotenv from 'dotenv';
dotenv.config(); 

import AWS from "aws-sdk";

const assetsBucket = process.env.AWS_S3_BUCKET_MASSCLICK; 
if (!assetsBucket) throw new Error("AWS S3 bucket not configured in env");

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new AWS.S3();


export const uploadImageToS3 = async (fileData, uploadPath) => {
  let fileBuffer;
  let mimeType;
  let extension;

  if (typeof fileData === "string" && fileData.startsWith("data:")) {
    const matches = fileData.match(/^data:([\w/+.-]+);base64,(.+)$/);
    if (!matches) throw new Error("Invalid base64 string");
    
    mimeType = matches[1]; 
    fileBuffer = Buffer.from(matches[2], "base64");
    extension = mimeType.split("/")[1] || "bin";
  } 
  else if (Buffer.isBuffer(fileData)) {
    fileBuffer = fileData;
    mimeType = "application/octet-stream";
    extension = "bin";
  } 
  else {
    throw new Error("Invalid file format. Must be Base64 or Buffer.");
  }
  const s3Key = `${uploadPath}.${extension}`;
  const params = {
    Bucket: assetsBucket,
    Key: s3Key,
    Body: fileBuffer,
    ContentType: mimeType,
  };
  await s3.upload(params).promise();
  return { key: s3Key };
};

export const getSignedUrlByKey = (key, bucketName, expiryTime = 3600) => {
  if (!key) return "";

  const params = {
    Bucket: bucketName ?? assetsBucket,
    Key: key,
    Expires: expiryTime,
  };

  return s3.getSignedUrl("getObject", params);
};