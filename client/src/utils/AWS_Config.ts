import AWS from 'aws-sdk';

// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_KEY,
    region: process.env.NEXT_PUBLIC_AWS_REGION
});

// Create an S3 instance
const s3 = new AWS.S3();

export const getURL = (key: string) => {
    const params = {
        Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET,
        Key: key
    }
    const url = s3.getSignedUrl('getObject', params);
    return url;
}