'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {

  const router = useRouter()

  useEffect(() => {
    // router.push('/dashboard');
  }, [])

  return (
    <div className="w-full h-full">

      <div className="w-full h-20 border-b-[1px] border-gray-800 flex flex-row items-center px-3 sm:px-10 xl:px-20">
        <p className="text-5xl font-bold">CMS</p>
      </div>


      <div className="w-full h-full flex flex-row gap-20 items-center px-3 sm:px-10 xl:px-20 my-10 md:my-20">


        <div className="w-full flex flex-col gap-5">
          <h2 className="text-4xl xl:text-6xl font-semibold">Welcome to Your Ultimate Content Management Solution</h2>

          <h4 className="text-2xl xl:text-3xl">Effortlessly manage, create, and publish your content with our intuitive CMS platform.</h4>

          <div className="flex flex-row gap-7 xl:my-5">
            <button onClick={() => router.push('/login')} className="px-5 sm:px-10 py-2 bg-[#007BFF] border-2 border-[#007BFF] rounded-lg text-base sm:text-xl font-bold hover:bg-transparent hover:border-white duration-300">Log In</button>
            <button onClick={() => router.push('/signUp')} className="px-5 sm:px-10 py-2 bg-transparent border-2 rounded-lg text-base sm:text-xl font-bold hover:bg-[#007BFF] hover:border-[#007BFF] duration-300">Sign Up</button>
          </div>

          <p className="text-base sm:text-lg">Join thousands of creators in managing and publishing their content seamlessly. Whether you're a blogger, developer, or business owner, our CMS platform is designed to simplify your workflow and empower your creativity. Start your journey today and take control of your content like never before!</p>
        </div>

        <div className="w-full flex-row items-center justify-center hidden lg:flex">
          <img src="/heroSec.svg" />
        </div>

      </div>

    </div>
  );
}

