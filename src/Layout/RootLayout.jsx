import React from 'react';
import { Outlet } from 'react-router';
import Footer from '../Pages/Sheard/Footer/Footer';
import Navbar from '../Pages/Sheard/Navbar/Navbar';

const RootLayout = () => {
    return (
        <div className='   min-h-screen bg-base-300'>
            <div className="mx-auto max-w-[1350px] px-4 py-5 sm:px-6 lg:p-10">
        <header>
                <Navbar></Navbar>
            </header>
         <main>
               <Outlet></Outlet>
         </main>
           <footer>
            <Footer></Footer>
           </footer>
            </div>
            
        </div>
    );
};

export default RootLayout;
