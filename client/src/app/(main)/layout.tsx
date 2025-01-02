'use client'
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/common/Header";
import { UserProvider, useUserContext } from "@/context/userContext";
import { PostProvider } from "@/context/postContext";
import Loader from "@/components/common/Loader";

// export const metadata = {
//   title: "Authentication - My Blogging Website",
//   description: "Log in or sign up to access your account.",
// };

export default function MainLayout({ children }: { children: React.ReactNode }) {

  const {loading} = useUserContext();

  return (
    // <UserProvider>
      <PostProvider>
        <div className="relative">
          {
            loading &&
            <Loader/>
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
    // </UserProvider >
  );
}
