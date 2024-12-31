
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Header from "@/components/common/Header";
import { UserProvider } from "@/context/userContext";
import { PostProvider } from "@/context/postContext";

// export const metadata = {
//   title: "Authentication - My Blogging Website",
//   description: "Log in or sign up to access your account.",
// };

export default function MainLayout({ children }: { children: React.ReactNode }) {

  return (
    <UserProvider>
      <PostProvider>
        <div>
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
    </UserProvider >
  );
}
