'use client'
import { useUserContext } from "@/context/userContext";
import Loader from "@/components/common/Loader";

// export const metadata = {
//   title: "Login | SignUp",
//   description: "Log in or sign up to access your account.",
// };

export default function MainLayout({ children }: { children: React.ReactNode }) {

    const { loading } = useUserContext();

    return (
        <div className="relative">
            {
                loading &&
                <Loader />
            }
            <div className="w-full bg-[#06040B]">
                <div className="w-full bg-[#06040B] text-gray-200">
                    {children}
                </div>
            </div>
        </div>
    );
}
