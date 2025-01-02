import axios from "axios";
import axiosCall from "./ApiCall";
import toast from "react-hot-toast";

export const handleDate = (date: any) => {
    const newDate = new Date(date);
    return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`
}

export function isValidPassword(password: string) {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasDigit = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUppercase && hasLowercase && hasDigit && hasSpecialChar;
}

export const uploadToS3 = async (uploadUrl: string, file: File | undefined, key: string, setLoaing: any, folderName: any, fetchMedia?: any, setKey?: any) => {
    try {
        const response = await axios.put(uploadUrl, file);
        // console.log(response, "upload to s3");

        if (response.status === 200 || response.status === 201) {
            const payload = {
                folderName: folderName,
                fileName: file?.name,
                contentType: file?.type,
                key: key
            }

            const resp = await axiosCall('post', `${process.env.NEXT_PUBLIC_BASE_URL}/media`, payload);

            if(resp.status === 200 || resp.status === 201){
                toast.success(resp.data.message, { duration: 2000 });
                if(fetchMedia){
                    fetchMedia();
                }
                if(setKey){
                    setKey(key);
                }
            }else{
                toast.error(resp.data.message, { duration: 2000 });
            }
            setLoaing(false)
        } else {
            toast.error("File not uploaded", { duration: 2000 })
            setLoaing(false);
        }

    } catch (error) {
        setLoaing(false);
        console.log(error);
    }
}