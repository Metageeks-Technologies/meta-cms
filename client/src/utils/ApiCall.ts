import axios, { AxiosRequestHeaders, Method } from 'axios';


const axiosCall = async (method: Method, url: string, data?: object, headers?: AxiosRequestHeaders ): Promise<any> => {
    const config: Record<string, any> = {
        method : method.toUpperCase(),
        url,
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
        console.error('API call failed:', error.message);
        throw error.response
            ? error.response.data // Return the server's error response
            : { message: 'Network error or server not reachable' };
    }
};

export default axiosCall;
