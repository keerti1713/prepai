import { Outfit } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Provider from "./provider"
import { Toaster } from "@/components/ui/toaster";

export const metadata = {
  title: "PrepAI",
  description: "Learn Smarter with AI generated courses, flashcards and quizzes.",
  icons: {
    icon: "/logo.svg",  
  },
};

const outfit=Outfit({subsets:["latin"]});

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body
        className={outfit.className}
      >
        <Provider>
          {children}
        </Provider>
        <Toaster />
      </body>
    </html>
    </ClerkProvider>
  );
}
