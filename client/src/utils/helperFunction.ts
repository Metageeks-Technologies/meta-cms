import axiosCall from "./ApiCall";

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

export const uploadToS3 = async (uploadUrl: string, file: File | undefined) => {
    try {
        console.log('upload start')
        const response = await axiosCall('post', uploadUrl, file);

        console.log(response);

    } catch (error) {
        console.log(error);
    }
}