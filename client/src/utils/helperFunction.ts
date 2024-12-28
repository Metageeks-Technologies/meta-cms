
export const handleDate = (date: any) => {
    const newDate = new Date(date);
    return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()}`
}

export const getUserFromLocalStorage = (setUser: any) => {
    const userString = localStorage.getItem('user');
    if (userString) {
        const userData = JSON.parse(userString);
        if (userData && userData._id) {
            setUser(userData);
        } else {
            console.log('User not found');
        }
    } else {
        console.log('No user data found in localStorage.');
    }
}