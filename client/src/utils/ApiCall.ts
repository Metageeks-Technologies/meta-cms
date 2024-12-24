import axios, { AxiosRequestHeaders, Method } from 'axios';
import toast from 'react-hot-toast';


const axiosCall = async (method: Method, url: string, data?: object, headers?: AxiosRequestHeaders ): Promise<any> => {
    const config: Record<string, any> = {
        method : method.toUpperCase(),
        url,
        withCredentials: true,
    };

    if (data) {
        config.data = data;
    }

    if (headers) {
        config.headers = headers;
    }

    try {
        const response = await axios(config);
        return response.data; // Return the data from the response
    } catch (error: any) {
        console.log('API call failed:', error.message);
        toast.error('Something went wrong', {
            duration: 2000,
        })
        throw error.response
            ? error.response.data // Return the server's error response
            : { message: 'Network error or server not reachable' };
    }
};

export default axiosCall;
