'use client'
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/common/Header";
import {  useUserContext } from "@/context/userContext";
import { PostProvider } from "@/context/postContext";
import Loader from "@/components/common/Loader";
import { useEffect } from "react";
import { PageProvider } from "@/context/pageContext";



export default function MainLayout({ children }: { children: React.ReactNode }) {

  const { loading, getUserProfile } = useUserContext();

  useEffect(() => {
    getUserProfile();
  }, []);

  return (
    <PageProvider>
      <PostProvider>
        <div className="relative">
          {
            loading &&
            <Loader />
          }
          <div className="w-full bg-[#06040B]">
            <SidebarProvider>
              <AppSidebar />
              <div className="w-full bg-[#06040B] text-gray-200">
                <Header />
                {children}
              </div>
            </SidebarProvider>
          </div>
        </div>
      </PostProvider >
    </PageProvider>
  );
}
