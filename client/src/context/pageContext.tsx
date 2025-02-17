import { createContext, ReactNode, useContext, useState } from "react";
import { useUserContext } from "./userContext";
import axiosCall from "@/utils/ApiCall";
import toast from "react-hot-toast";

const pageContext = createContext<any>(null)

interface PageContextType {
  pageData: any,
  services: any,
  subServices: any,
  fetchPageData: () => void,
  fetchServices: () => void,
  fetchAllServices: () => void,
  fetchSubServices: (id: string) => void,

  recoverPage: (id: string) => void,
  recoverServices: (id: string) => void,
  recoverSubServices: (id: string, serviceId: string) => void,
  fetchSubServicesTotal: (id: string) => void,
  deletePage: (id: string) => void,
  deleteServices: (id: string) => void,
  deleteSubServices: (id: string, serviceId: string) => void,
}


export const PageProvider = ({ children }: { children: ReactNode }) => {

  const { setLoading } = useUserContext();
  const [pageData, setPageData] = useState([]);
  const [services, setService] = useState([]);
  const [subServices, setSubService] = useState([]);


  const { websiteKey } = useUserContext();



  const fetchPageData = async () => {
    setLoading(true);
    try {
      const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/pages/all`, undefined, { websiteKey: websiteKey });

      if (resp?.status === 200 || resp?.status === 201) {
        setPageData(resp.data)
      } else {
        toast.error(resp?.data?.message, { duration: 2000 });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const fetchServices = async () => {
    setLoading(true);
    try {
      const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/services`, undefined, { websiteKey: websiteKey });

      if (resp?.status === 200 || resp?.status === 201) {
        setService(resp.data)
      } else {
        toast.error(resp?.data?.message, { duration: 2000 });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const fetchAllServices = async () => {
    setLoading(true);
    try {
      const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/services/all`, undefined, { websiteKey: websiteKey });

      if (resp?.status === 200 || resp?.status === 201) {
        setService(resp.data)
      } else {
        toast.error(resp?.data?.message, { duration: 2000 });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }



  const recoverServices = async (id: string) => {
    setLoading(true);
    try {
      const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/services/${id}/recover`, undefined, { websiteKey: websiteKey });
      if (resp.status === 200 || resp.status === 201) {
        toast.success(resp.data.message, { duration: 2000 });
        fetchServices();
      } else {
        toast.error(resp?.data?.message, { duration: 2000 });
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  const deleteServices = async (id: string) => {
    setLoading(true);
    try {
      const resp = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/services/${id}`, undefined, { websiteKey: websiteKey });
      if (resp.status === 200 || resp.status === 201) {
        toast.success(resp.data.message, { duration: 2000 });
        fetchAllServices();
      } else {
        toast.error(resp?.data?.message, { duration: 2000 });
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }


  const recoverPage = async (id: string) => {
    setLoading(true);
    try {
      const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/pages/${id}/recover`, undefined, { websiteKey });
      if (resp.status === 200 || resp.status === 201) {
        toast.success(resp.data.message, { duration: 2000 });
        fetchPageData();
      } else {
        toast.error(resp?.data?.message, { duration: 2000 });
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  const deletePage = async (id: string) => {
    setLoading(true);
    try {
      const resp = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/pages/${id}`, undefined, { websiteKey });
      if (resp.status === 200 || resp.status === 201) {
        toast.success(resp.data.message, { duration: 2000 });
        fetchPageData();
      } else {
        toast.error(resp?.data?.message, { duration: 2000 });
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }



  const fetchSubServices = async (id: string) => {
    setLoading(true);
    try {
      const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/subservices`, undefined, { websiteKey: websiteKey });

      // console.log(resp+"  subservices")

      if (resp?.status === 200 || resp?.status === 201) {
        setSubService(resp.data)
      } else {
        toast.error(resp?.data?.message, { duration: 2000 });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const fetchSubServicesTotal = async (id: string) => {
    setLoading(true);
    try {
      const resp = await axiosCall('get', `${process.env.NEXT_PUBLIC_BASE_URL}/subservices/total/${id}`, undefined, { websiteKey: websiteKey });

      // console.log(resp+"  subservices")

      if (resp?.status === 200 || resp?.status === 201) {
        setSubService(resp.data)
      } else {
        toast.error(resp?.data?.message, { duration: 2000 });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }




  const recoverSubServices = async (id: string, serviceId: string) => {
    setLoading(true);
    try {
      const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/subservices/${id}/recover`, undefined, { websiteKey: websiteKey });
      if (resp.status === 200 || resp.status === 201) {
        toast.success(resp.data.message, { duration: 2000 });
        fetchSubServicesTotal(serviceId);
      } else {
        toast.error(resp?.data?.message, { duration: 2000 });
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }

  const deleteSubServices = async (id: string, serviceId: string) => {
    setLoading(true);
    try {
      const resp = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/subservices/${id}`, undefined, { websiteKey: websiteKey });
      if (resp.status === 200 || resp.status === 201) {
        toast.success(resp.data.message, { duration: 2000 });
        fetchSubServicesTotal(serviceId);
      } else {
        toast.error(resp?.data?.message, { duration: 2000 });
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false);
    }
  }


  const contextValues: PageContextType = {
    pageData,
    services,
    subServices,
    fetchServices,
    fetchAllServices,
    fetchSubServices,
    fetchSubServicesTotal,
    fetchPageData,
    recoverPage,
    recoverServices,
    recoverSubServices,

    deletePage,
    deleteServices,
    deleteSubServices
  }

  return (
    <pageContext.Provider value={contextValues}>
      {children}
    </pageContext.Provider>
  )

}

export const usePageContext = () => {
  const context = useContext(pageContext);
  if (!context) {
    throw new Error("usePageContext must be used within a PageProvider");
  }
  return context;
}