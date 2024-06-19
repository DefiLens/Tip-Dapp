"use client";
import InputForm from "@/components/custom/InputForm";
import Header from "@/components/Header";
import { usePrivy } from "@privy-io/react-auth";


export default function Home() {
    const { user } = usePrivy();

    return (
        <main>
            <Header />
            <InputForm/>

            {/* <section className="relative">
                <img
                    src="https://img.freepik.com/premium-vector/modern-abstract-blue-line-dark-background_104237-195.jpg?w=1060"
                    alt="Hero Background"
                    className="w-full h-screen object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-80"></div>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white">
                    <h1 className="text-5xl font-bold mb-4">Explore Onchain Tip</h1>
                </div>
            </section> */}
            <textarea
                value={JSON.stringify(user, null, 2)}
                className="mt-2 w-full rounded-md bg-slate-700 p-4 font-mono text-xs text-slate-50 sm:text-sm"
                rows={JSON.stringify(user, null, 2).split("\n").length}
                disabled
            />
        </main>
    );
}
