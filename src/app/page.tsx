"use client";
import Footer from "@/components/custom/Footer";
import InputForm from "@/components/custom/InputForm";
import Header from "@/components/Header";
import { usePrivy } from "@privy-io/react-auth";


export default function Home() {
    const { user } = usePrivy();

    return (
        <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
        <Header />

          <InputForm />
        </main>
        <Footer />
        <textarea
          value={JSON.stringify(user, null, 2)}
          className="mt-2 w-full rounded-md bg-slate-700 p-4 font-mono text-xs text-slate-50 sm:text-sm"
          rows={JSON.stringify(user, null, 2).split("\n").length}
          disabled
        />
      </div>
    );
}
