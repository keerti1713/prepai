'use client'
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function Home() {
  const router = useRouter();

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="min-h-screen w-full flex flex-col bg-gradient-to-b from-gray-100 to-gray-50 items-center justify-center text-white px-6 text-center">
        <div className="relative flex items-center justify-center h-32 w-32 rounded-full">
        <Image src={"/logo.svg"} alt="Logo" width={50} height={50} className="h-20 w-20" /> 
        <h2 className="m-3 font-bold text-black text-[55px]">PrepAI</h2>
      </div>
        <p className="text-md md:text-lg text-gray-400 max-w-xl font-bold">
        Learn Smarter with AI - Flashcards, Quizzes & More!
        </p>
        
          <Button className="m-5 px-6 py-3 text-lg font-semibold rounded-full bg-gradient-to-b from-purple-800 to-purple-600 hover:bg-purple-800 transition-all shadow-lg"
            onClick={() => router.push("/dashboard")}
          >
            Get Started
          </Button>

      </div>
    </div>
    
  );
}
