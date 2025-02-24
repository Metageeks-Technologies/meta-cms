
export const getURL = (key: string | undefined) => {
    // const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
    const url = `${process.env.NEXT_PUBLIC_CDN}/${key}`; 
    return url;
}