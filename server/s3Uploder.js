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


export const uploadImageToS3 = async (base64Image, uploadPath) => {
    const matches = base64Image.match(/^data:image\/([a-zA-Z]+);base64,(.+)$/);
    if (!matches) throw new Error("Invalid base64 string");

    const extension = matches[1];
    const imageBuffer = Buffer.from(matches[2], "base64");
    const s3Key = `${uploadPath}.${extension}`; 

    const params = {
        Bucket: assetsBucket,
        Key: s3Key,
        Body: imageBuffer,
        ContentType: `image/${extension}`,
    };

    await s3.upload(params).promise();
    return { key: s3Key }; 
};

export const getSignedUrlByKey = (key, bucketName, expiryTime = null) => {
    if (!key) return ''; 
    
    const params = {
        Bucket: bucketName ?? assetsBucket, 
        Key: key,
        Expires: expiryTime || 3600, 
    };

    return s3.getSignedUrl('getObject', params);
};