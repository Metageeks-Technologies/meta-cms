
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