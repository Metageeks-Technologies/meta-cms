
export const getURL = (key: string | undefined) => {
    const url = `${process.env.NEXT_PUBLIC_CDN}/${key}`; 
    return url;
}