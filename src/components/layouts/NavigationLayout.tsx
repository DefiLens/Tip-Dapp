import Sidebar from "../Sidebar";
import Header from "../Header";

const NavigationLayout = ({ children }: any) => {
    return (
        <main className="h-screen">
            <div className="relative max-w-6xl w-full mx-auto flex">
                <Sidebar />
                <div className="relative flex-1 h-full">
                    <div className="sticky top-0 z-40">
                        <Header />
                    </div>
                    {children}
                </div>
                <div className="sticky top-0 h-screen hidden md:flex w-60 border-sky-100 border-l"></div>
            </div>
        </main>
    );
};

export default NavigationLayout;
