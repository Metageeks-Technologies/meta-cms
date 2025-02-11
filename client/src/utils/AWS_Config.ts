
export const getURL = (key: string | undefined) => {
    // const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET}.s3.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${key}`;
    const url = `https://dflev6ps7l4nq.cloudfront.net/${key}`;
    return url;
}