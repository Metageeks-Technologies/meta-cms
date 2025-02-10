import axios, { Method } from 'axios';
import toast from 'react-hot-toast';


const axiosCall = async (method: Method, url: string, data?: object, headers?: object ): Promise<any> => {
    const config: Record<string, any> = {
        method : method.toUpperCase(),
        url,
        withCredentials: true,
        headers: headers || {}
    };

    if (data) {
        config.data = data;
    }

    try {

        console.log(config, "Config");
        const response = await axios(config);
        return response; // Return the data from the response
    } catch (error: any) {
        console.log('API call failed:', error.message);
        return error.response;
        throw error.response
            ? error.response.data // Return the server's error response
            : { message: 'Network error or server not reachable' };
    }
};

export default axiosCall;
