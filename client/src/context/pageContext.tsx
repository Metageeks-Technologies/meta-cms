import { createContext, ReactNode, useContext, useState } from "react";
import { useUserContext } from "./userContext";
import axiosCall from "@/utils/ApiCall";
import toast from "react-hot-toast";

const pageContext = createContext<any>(null)

interface PageContextType {
  pageData: any,
  fetchPageData: () => void,
  recoverPage: (id: string) => void,
  deletePage: (id: string) => void,
}


export const PageProvider = ({ children }: { children: ReactNode }) => {

  const { setLoading } = useUserContext();
  const [pageData, setPageData] = useState([]); 

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


  const recoverPage = async (id: string) => {
    setLoading(true);
    try {
      const resp = await axiosCall('patch', `${process.env.NEXT_PUBLIC_BASE_URL}/pages/${id}/recover`);
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
      const resp = await axiosCall('delete', `${process.env.NEXT_PUBLIC_BASE_URL}/pages/${id}`);
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


  const contextValues: PageContextType = {
    pageData,
    fetchPageData,
    recoverPage,
    deletePage,
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