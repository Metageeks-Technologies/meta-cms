
export const getURL = (key: string | undefined) => {
    const region = 'us-east-1'; // Replace with your bucket's region if necessary
    const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
    return url;
}