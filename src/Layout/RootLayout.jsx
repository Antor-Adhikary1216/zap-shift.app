import { Outlet } from 'react-router';
import Footer from '../Pages/Sheard/Footer/Footer';
import Navbar from '../Pages/Sheard/Navbar/Navbar';

const RootLayout = () => {
    return (
        <div className="min-h-screen overflow-x-clip bg-base-300">
            <div className="mx-auto w-full max-w-[1350px] px-3 py-3 min-[380px]:px-4 min-[380px]:py-5 sm:px-6 lg:p-10">
                <header>
                    <Navbar />
                </header>
                <main className="min-w-0">
                    <Outlet />
                </main>
                <footer>
                    <Footer />
                </footer>
            </div>
        </div>
    );
};

export default RootLayout;
